export type Status = 'ready' | 'moving' | 'checking' | 'error' | 'success';

export const getIndicatorStyle = (status: Status) => {
  const styles = {
    ready: {},
    moving: {
      backgroundColor: '#d1e9fe',
    },
    checking: {
      backgroundColor: '#d1e9fe',
    },
    error: {
      backgroundColor: '#fce1e1',
    },
    success: {
      backgroundColor: '#d2f4ef',
    },
  };
  return styles[status];
};

export const getSliderStyle = (status: Status) => {
  const styles = {
    ready: {},
    moving: {
      backgroundColor: '#1991fa',
      borderColor: '#1991fa',
      color: 'white',
    },
    checking: {
      backgroundColor: '#1991fa',
      borderColor: '#1991fa',
      color: 'white',
    },
    error: {
      backgroundColor: '#f57a7a',
      borderColor: '#f57a7a',
      color: 'white',
    },
    success: {
      backgroundColor: '#52ccba',
      borderColor: '#52ccba',
      color: 'white',
    },
  };
  return styles[status];
};
