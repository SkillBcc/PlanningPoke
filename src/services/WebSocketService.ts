import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface UserState {
  id: string;
  name: string;
  hasVoted: boolean;
  vote: string | null;
  isOnline: boolean;
  isSpectator: boolean;
}

export interface TaskState {
  id: string;
  title: string;
  votes: Record<string, { userName: string; vote: string }>;
  isRevealed: boolean;
}

export interface RoomState {
  id: string;
  ownerId: string;
  activeTaskId: string | null;
  tasks: TaskState[];
  createdAt: number;
  users: UserState[];
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private roomStateSubject = new BehaviorSubject<RoomState | null>(null);
  public roomState$ = this.roomStateSubject.asObservable();
  public connectionStatus$ = new BehaviorSubject<boolean>(false);

  private userId: string;
  private userName: string = '';

  constructor() {
    let storedId = localStorage.getItem('poker_user_id');
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem('poker_user_id', storedId);
    }
    this.userId = storedId;
    
    const storedName = localStorage.getItem('poker_user_name');
    if (storedName) {
      this.userName = storedName;
    }
  }

  public getUserId() {
    return this.userId;
  }

  public getUserName() {
    return this.userName;
  }

  public setUserName(name: string) {
    this.userName = name;
    localStorage.setItem('poker_user_name', name);
  }

  public connect(roomId: string, name: string, initialTask?: string) {
    this.setUserName(name);
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.connectionStatus$.next(true);
      this.ws?.send(JSON.stringify({
        type: 'JOIN_ROOM',
        payload: {
          roomId,
          user: { id: this.userId, name: this.userName },
          initialTask
        }
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ROOM_STATE') {
        this.roomStateSubject.next(data.payload);
      }
    };

    this.ws.onclose = () => {
      this.connectionStatus$.next(false);
      // Attempt reconnect logic could go here
    };
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.roomStateSubject.next(null);
  }

  public vote(vote: string | null) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'VOTE',
        payload: { vote }
      }));
    }
  }

  public reveal() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'REVEAL' }));
    }
  }

  public reset() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'RESET' }));
    }
  }

  public addTask(title: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'ADD_TASK',
        payload: { title }
      }));
    }
  }

  public setActiveTask(taskId: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'SET_ACTIVE_TASK',
        payload: { taskId }
      }));
    }
  }

  public editTask(taskId: string, title: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'EDIT_TASK',
        payload: { taskId, title }
      }));
    }
  }

  public deleteTask(taskId: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'DELETE_TASK',
        payload: { taskId }
      }));
    }
  }

  public toggleSpectator(isSpectator: boolean) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'TOGGLE_SPECTATOR',
        payload: { isSpectator }
      }));
    }
  }
}

export const wsService = new WebSocketService();
