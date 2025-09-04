import React from 'react'

interface ConditionalRendererProps {
  isVisible: boolean;
  children: React.ReactNode;
}

export const ConditionalRenderer: React.FC<ConditionalRendererProps> = ({isVisible, children}) => {
  return (
    <>
      {isVisible && children}
    </>
  )
}
