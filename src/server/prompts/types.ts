/** Сообщение промпта */
export type PromptMessage = {
    content: {
        text: string;
        type: 'text';
    };
    role: 'user';
};

/** Ответ промпта */
export type PromptResponse = {
    messages: PromptMessage[];
};
