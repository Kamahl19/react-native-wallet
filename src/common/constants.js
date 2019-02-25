export const FETCH_BALANCE_INTERVAL_MS = 1000 * 60 * 1;

export const TX_DIRECTIONS = {
  SENT: 'sent',
  RECEIVED: 'received',
};

export const txDirectionOptions = [
  { label: 'Sent', value: TX_DIRECTIONS.SENT },
  { label: 'Received', value: TX_DIRECTIONS.RECEIVED },
];

export const DEFAULT_TX_DIRECTION = TX_DIRECTIONS.SENT;
