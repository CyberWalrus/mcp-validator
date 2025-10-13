/** Интерфейс для процесса, который можно завершить */
export type KillableProcess = {
    kill: (signal: NodeJS.Signals) => void;
    killed?: boolean;
    pid?: number;
    platform?: string;
};
