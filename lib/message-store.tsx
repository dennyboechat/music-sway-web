import React, { createContext, useState, useMemo, useContext } from 'react';

interface Message {
  message?: string,
  severity?: string,
}

interface MessageState {
  alertMessage?: Message;
  setAlertMessage: React.Dispatch<React.SetStateAction<Message | undefined>>;
}

const MessageStateContext = createContext<MessageState | undefined>(undefined);

export const MessageStateProvider: React.FC = (props) => {
  const [alertMessage, setAlertMessage] = useState<Message | undefined>();
  const value = useMemo(() => ({ alertMessage, setAlertMessage }), [alertMessage]);
  return (
    <MessageStateContext.Provider value={value} {...props} />
  );
};

export const useMessageState = (): MessageState => {
  const context = useContext(MessageStateContext);
  if (!context) {
    throw new Error("You need to wrap MessageStateProvider.");
  }
  return context;
};
