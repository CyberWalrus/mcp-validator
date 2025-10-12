import { z } from 'zod';

/** Схема базового JSON-RPC запроса */
export const JSONRPCRequestSchema = z.object({
    /** Идентификатор запроса */
    id: z.union([z.string(), z.number()]),

    /** Версия протокола JSON-RPC */
    jsonrpc: z.literal('2.0'),

    /** Метод вызова */
    method: z.string(),
    /** Параметры запроса */
    params: z.unknown().optional(),
});

/** Схема MCP Initialize запроса */
export const MCPInitializeRequestSchema = JSONRPCRequestSchema.extend({
    method: z.literal('initialize'),
    params: z.object({
        /** Возможности клиента */
        capabilities: z.record(z.unknown()),

        /** Информация о клиенте */
        clientInfo: z.object({
            name: z.string(),
            version: z.string(),
        }),

        /** Версия протокола MCP */
        protocolVersion: z.string(),
    }),
});

/** Схема MCP Tools/Call запроса */
export const MCPToolCallRequestSchema = JSONRPCRequestSchema.extend({
    method: z.literal('tools/call'),
    params: z.object({
        /** Аргументы инструмента */
        arguments: z.record(z.unknown()),

        /** Имя инструмента */
        name: z.string(),
    }),
});

/** Схема JSON-RPC ответа */
export const JSONRPCResponseSchema = z.object({
    /** Ошибка операции */
    error: z
        .object({
            /** Код ошибки */
            code: z.number(),

            /** Дополнительные данные ошибки */
            data: z.unknown().optional(),

            /** Сообщение об ошибке */
            message: z.string(),
        })
        .optional(),

    /** Идентификатор запроса */
    id: z.union([z.string(), z.number()]),

    /** Версия протокола JSON-RPC */
    jsonrpc: z.literal('2.0'),

    /** Результат операции */
    result: z.unknown().optional(),
});

/** Схема MCP Tool результата */
export const MCPToolResultSchema = z.object({
    /** Контент ответа */
    content: z.array(
        z.object({
            /** Текстовое содержимое */
            text: z.string(),

            /** Тип контента */
            type: z.literal('text'),
        }),
    ),
});
