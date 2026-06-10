import { forwardRef, type HTMLAttributes } from "react";

type SectionWrapperProps = HTMLAttributes<HTMLElement> & {
  heightClassName?: string;
};

export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(
  ({ className = "", heightClassName = "min-h-screen", children, ...props }, ref) => (
    <section
      ref={ref}
      className={`relative ${heightClassName} ${className}`}
      {...props}
    >
      {children}
    </section>
  ),
);

SectionWrapper.displayName = "SectionWrapper";
