"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallbackText?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class MailboxErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[MailboxErrorBoundary] Uncaught component error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 p-8 bg-white flex flex-col items-center justify-center text-center space-y-4 h-full border border-slate-200 rounded-2xl">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="font-extrabold text-sm text-slate-900">
              {this.props.fallbackText || "We couldn't load this conversation."}
            </h4>
            <p className="text-xs text-slate-500">
              An unexpected rendering error occurred. You can safely try re-rendering or selecting another message.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
