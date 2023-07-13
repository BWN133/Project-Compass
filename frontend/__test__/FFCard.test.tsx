import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

import FFCard from '../src/component/FFCard';
import { FF as FFModel } from '../src/models/data';

const defaultProps = {
  FFContent: {
    _id: '1',
    title: 'Test Folder',
    objectType: 'FOLDER',
  } as FFModel,
  onclicked: jest.fn(),
  showCheckMark: false,
  handleCheckboxClick: jest.fn(),
};

const setup = (props = defaultProps) => {
  return render(<FFCard {...props} />);
};

describe('FFCard', () => {
  it('renders without crashing', () => {
    setup();
    expect(screen.getByText(defaultProps.FFContent.title)).toBeInTheDocument();
  });

  it('renders folder icon and title', () => {
    setup();
    expect(screen.getByText(defaultProps.FFContent.title)).toBeInTheDocument();
    expect(screen.getByLabelText('folder-icon')).toBeInTheDocument();
  });

  it('does not render a checkbox if showCheckMark is false', () => {
    setup();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('renders a checkbox if showCheckMark is true', () => {
    setup({ ...defaultProps, showCheckMark: true });
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('calls onclicked function when the card is clicked', () => {
    setup();
    userEvent.click(screen.getByText(defaultProps.FFContent.title));
    expect(defaultProps.onclicked).toHaveBeenCalledWith(defaultProps.FFContent._id, defaultProps.FFContent.objectType);
  });

  it('calls handleCheckboxClick function when the checkbox is clicked', () => {
    setup({ ...defaultProps, showCheckMark: true });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox, { stopPropagation: () => {} });
    expect(defaultProps.handleCheckboxClick).toHaveBeenCalledWith(defaultProps.FFContent._id, true);
  });
});