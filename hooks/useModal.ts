import React, { useEffect, useRef } from 'react';

/**
 * A custom hook to manage common modal accessibility and behavior.
 * It handles focus trapping, closing on Escape, and restoring focus on close.
 * @param modalRef A ref to the main modal container element.
 * @param isOpen A boolean indicating if the modal is currently open.
 * @param onClose The function to call when the modal should be closed.
 */
export const useModal = (modalRef: React.RefObject<HTMLElement>, isOpen: boolean, onClose: () => void) => {
  const returnFocusToRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Only run the effect if the modal is open
    if (!isOpen) {
      return;
    }
      
    // When modal opens, store the element that currently has focus
    returnFocusToRef.current = document.activeElement as HTMLElement;
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      // Close modal on Escape key
      if (event.key === 'Escape') {
        onClose();
      }
      
      // Focus trapping logic
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift+Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Set initial focus to the first focusable element or the modal itself
    const timer = setTimeout(() => {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const elementToFocus = (focusableElements && focusableElements.length > 0) 
            ? focusableElements[0] 
            : modalRef.current;
            
        if (elementToFocus) {
            elementToFocus.focus();
        }
    }, 100);

    // Main cleanup for when modal closes or component unmounts
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);

      // Restore focus to the element that opened the modal
      if (returnFocusToRef.current && document.contains(returnFocusToRef.current)) {
        returnFocusToRef.current.focus();
      }
      returnFocusToRef.current = null;
    };
    
  }, [isOpen, onClose, modalRef]);
};