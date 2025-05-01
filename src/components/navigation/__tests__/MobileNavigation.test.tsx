
import React from 'react';
import { render, screen, fireEvent } from '@/utils/test-utils';
import MobileNavigation from '../MobileNavigation';
import { NavigationProvider } from '@/context/NavigationContext';

describe('MobileNavigation', () => {
  it('renders the mobile menu button', () => {
    render(<MobileNavigation />);
    const menuButton = screen.getByRole('button');
    expect(menuButton).toBeInTheDocument();
  });

  it('opens the menu when clicked', () => {
    render(
      <NavigationProvider>
        <MobileNavigation />
      </NavigationProvider>
    );
    
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    
    // Check if menu is opened (this would need to be adapted based on your implementation)
    // For example, if you have a data-state attribute:
    // expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open');
  });
});
