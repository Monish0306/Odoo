"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = ({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={cn('flex h-8 w-full appearance-none rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none', className)} {...props}>
    {children}
  </select>
);

function SelectGroup({ children, className, ...props }: React.HTMLAttributes<HTMLOptGroupElement>) {
  return (
    <optgroup className={className} {...props}>
      {children}
    </optgroup>
  );
}

function SelectValue({ children, placeholder }: { children?: React.ReactNode; placeholder?: string }) {
  return <>{children ?? placeholder}</>;
}

function SelectTrigger({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  );
}

function SelectContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-1 rounded-lg border border-slate-700 bg-slate-950 p-1', className)} {...props}>
      {children}
    </div>
  );
}

function SelectLabel({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn('text-sm text-slate-300', className)} {...props}>
      {children}
    </label>
  );
}

function SelectItem({ children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return <option {...props}>{children}</option>;
}

function SelectSeparator() {
  return null;
}

function SelectScrollUpButton() {
  return null;
}

function SelectScrollDownButton() {
  return null;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
