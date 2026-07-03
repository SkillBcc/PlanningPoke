import { useState, useEffect } from 'react';
import { wsService, RoomState } from '../../../core/services/WebSocketService';

export function useRoomState(roomId: string | undefined, userName: string, initialTask: string | undefined, initialDeckType: string) {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    if (!roomId || !userName) return;

    wsService.connect(roomId, userName, initialTask, initialDeckType);

    const roomSub = wsService.roomState$.subscribe(state => {
      setRoomState(state);
    });

    const connSub = wsService.connectionStatus$.subscribe(status => {
      setIsConnected(status);
    });

    const closedSub = wsService.isClosed$.subscribe(closed => {
      setIsClosed(closed);
    });

    return () => {
      roomSub.unsubscribe();
      connSub.unsubscribe();
      closedSub.unsubscribe();
      wsService.disconnect();
    };
  }, [roomId, userName, initialTask, initialDeckType]);

  const actions = {
    setActiveTask: (taskId: string) => wsService.setActiveTask(taskId),
    editTask: (taskId: string, title: string) => wsService.editTask(taskId, title),
    deleteTask: (taskId: string) => wsService.deleteTask(taskId),
    addTask: (title: string) => wsService.addTask(title),
    vote: (voteStr: string) => wsService.vote(voteStr),
    reveal: () => wsService.reveal(),
    setFinalEstimate: (taskId: string, estimate: string) => wsService.setFinalEstimate(taskId, estimate),
    changeDeck: (deckType: string) => wsService.changeDeck(deckType),
    startTimer: () => wsService.startTimer(),
    pauseTimer: () => wsService.pauseTimer(),
    resetTimer: () => wsService.resetTimer(),
    setTimerDuration: (seconds: number) => wsService.setTimerDuration(seconds),
    setAutoReveal: (enabled: boolean) => wsService.setAutoReveal(enabled)
  };

  return { roomState, isConnected, isClosed, actions, currentUserId: wsService.getUserId() };
}

