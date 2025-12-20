export const generateRoomId = (userId1: string, userId2: string): string => {
  const sorted = [userId1, userId2].sort();
  return `${sorted[0]}_${sorted[1]}`;
};
