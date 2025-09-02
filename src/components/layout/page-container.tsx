import type React from "react";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full space-y-4">{children}</div>;
};

export const PageHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
};

export const PageHeaderContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="w-full space-y-2">{children}</div>;
};

export const PageTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-3">
      <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl lg:text-4xl">
        {children}
      </h1>
    </div>
  );
};

export const PageDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <p className="text-neutral-600 text-sm leading-relaxed sm:text-base">
      {children}
    </p>
  );
};

export const PageActions = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      {children}
    </div>
  );
};

export const PageContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-4">{children}</div>;
};
