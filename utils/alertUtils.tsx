import React from "react";
import { CustomAlert } from "@/components/CustomAlert";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface AlertOptions {
  type?: AlertType;
  buttons?: AlertButton[];
  onDismiss?: () => void;
}

class AlertManager {
  private static instance: AlertManager;
  public alertState: {
    visible: boolean;
    title: string;
    message?: string;
    buttons: AlertButton[];
    type: AlertType;
    onDismiss?: () => void;
  } = {
    visible: false,
    title: "",
    message: "",
    buttons: [{ text: "OK" }],
    type: "info",
  };

  private listeners: Set<(state: typeof this.alertState) => void> = new Set();

  private constructor() {}

  public static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager();
    }
    return AlertManager.instance;
  }

  public show(title: string, message?: string, options?: AlertOptions): void {
    this.alertState = {
      visible: true,
      title,
      message,
      buttons: options?.buttons || [{ text: "OK" }],
      type: options?.type || "info",
      onDismiss: () => {
        this.hide();
        options?.onDismiss?.();
      },
    };
    this.notifyListeners();
  }

  public hide(): void {
    this.alertState = { ...this.alertState, visible: false };
    this.notifyListeners();
  }

  public subscribe(
    listener: (state: typeof this.alertState) => void
  ): () => void {
    this.listeners.add(listener);
    listener(this.alertState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.alertState);
    });
  }
}

export const alertManager = AlertManager.getInstance();

export const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    type?: AlertType
  ) => {
    alertManager.show(title, message, { buttons, type });
  },
  success: (title: string, message?: string, buttons?: AlertButton[]) => {
    alertManager.show(title, message, { buttons, type: "success" });
  },
  error: (title: string, message?: string, buttons?: AlertButton[]) => {
    alertManager.show(title, message, { buttons, type: "error" });
  },
  warning: (title: string, message?: string, buttons?: AlertButton[]) => {
    alertManager.show(title, message, { buttons, type: "warning" });
  },
  info: (title: string, message?: string, buttons?: AlertButton[]) => {
    alertManager.show(title, message, { buttons, type: "info" });
  },
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alertState, setAlertState] = React.useState(alertManager.alertState);

  React.useEffect(() => {
    return alertManager.subscribe(setAlertState);
  }, []);

  return (
    <>
      {children}
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        type={alertState.type}
        onDismiss={alertState.onDismiss}
      />
    </>
  );
};
