---
id: test-guide-advanced
type: reference
use_cases: ['advanced_mocking', 'browser_testing', 'e2e_patterns', 'test_automation']
alwaysApply: false
---

# 🧪 Продвинутые Техники Тестирования

[REFERENCE-BEGIN]

## 🎯 TIER 1: Expert Role

<expert_role>
Ты эксперт по продвинутым техникам тестирования в TypeScript проектах.
Твоя специализация: создание качественных тестов с мокированием, браузерное React тестирование, E2E автоматизация.
Используй эти паттерны для написания надежных тестов в Vitest, React Testing Library, Playwright.

**ВАЖНО: Все ответы должны быть на русском языке.**
Код, имена API, пути к файлам оставляй на английском в обратных кавычках.
</expert_role>

## 🛠 TIER 2: Testing Setup Instructions

<setup_guidance>
При настройке продвинутого тестирования используй следующий tech stack:

**Для браузерного React тестирования:**

```bash
yarn add -D vitest @vitest/browser vitest-browser-react playwright
```

**Для E2E автоматизации:**

```bash
npx playwright install chromium firefox webkit
```

<completion_criteria>
Все зависимости установлены, конфигурация Vitest и Playwright настроена
</completion_criteria>

<exception_handling>
Если установка браузеров Playwright не удалась: используй `npx playwright install --with-deps`
Если конфликт версий: проверь совместимость с основными зависимостями проекта
</exception_handling>
</setup_guidance>

## 🎭 TIER 3: Advanced Mocking Patterns

<mocking_instructions>
При создании моков для тестов применяй следующие паттерны:

### 1. 🏗️ Базовое мокирование модулей

```typescript
vi.mock('node:fs', async (importOriginal) => {
    const actual = await importOriginal<typeof import('node:fs')>();
    return {
        ...actual,
        readFileSync: vi.fn(),
        writeFileSync: vi.fn(),
        existsSync: vi.fn().mockReturnValue(true),
    };
});

const mockReadFileSync = vi.mocked(readFileSync);
mockReadFileSync.mockReturnValue('mocked content');
```

### 2. 🎯 Factory функции для тестовых данных

```typescript
const createMockUser = (overrides = {}) => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
});

it('должен обрабатывать админа', () => {
    const admin = createMockUser({ role: 'admin' });
    expect(processUser(admin).permissions).toContain('delete');
});
```

### 3. 🌐 HTTP клиенты и API

```typescript
const mockFetch = vi.fn() as MockedFunction<typeof fetch>;
global.fetch = mockFetch;

const setupFetchMock = {
    success: <T>(data: T) =>
        mockFetch.mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(data),
            status: 200,
        } as any),

    error: (status: number, message: string) =>
        mockFetch.mockResolvedValue({
            ok: false,
            status,
            statusText: message,
            json: vi.fn().mockResolvedValue({ error: message }),
        } as any),
};

it('должен обрабатывать успешный ответ', async () => {
    setupFetchMock.success({ users: [createMockUser()] });
    const result = await apiClient.getUsers();
    expect(result).toHaveLength(1);
});
```

### 4. ⏰ Время и асинхронность

```typescript
beforeAll(() => vi.useFakeTimers());
afterAll(() => vi.useRealTimers());

it('должен выполняться через заданное время', () => {
    const callback = vi.fn();
    setTimeout(callback, 1000);

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalled();
});

const mockDate = new Date('2025-01-15T10:00:00Z');
vi.setSystemTime(mockDate);
```

<completion_criteria>
Моки правильно типизированы, используют vi.mocked(), сбрасываются между тестами
</completion_criteria>

<exception_handling>
Если TypeScript не видит мок: используй `vi.mocked(functionName)` для типизации
Если мок не применяется: убедись что `vi.mock()` вызывается до импорта модуля
Если моки "протекают" между тестами: добавь `vi.clearAllMocks()` в `beforeEach`
</exception_handling>
</mocking_instructions>

## ⚛️ TIER 4: Browser React Testing

<browser_testing_instructions>
Для тестирования React компонентов в реальном браузере используй следующие паттерны:

### 1. 🔄 Пользовательские взаимодействия в браузере

```typescript
import { render, screen, cleanup } from 'vitest-browser-react';
import { userEvent } from '@vitest/browser/context';
import { test, expect, describe, afterEach } from 'vitest';

describe('Button Component Browser Tests', () => {
    afterEach(() => cleanup());

    test('должен обрабатывать клики и реальный focus в браузере', async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click me</Button>);

        const button = screen.getByRole('button');

        expect(button).toBeInTheDocument();
        expect(button.tagName).toBe('BUTTON');
        expect(getComputedStyle(button).display).toBe('inline-flex');

        await userEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);

        await userEvent.tab();
        expect(document.activeElement).toBe(button);
        expect(button).toHaveFocus();

        const focusOutline = getComputedStyle(button, ':focus').outline;
        expect(focusOutline).toBeTruthy();

        await userEvent.keyboard('{Enter}');
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    test('должен корректно работать с touch событиями', async () => {
        const onTouch = vi.fn();
        render(<Button onTouchStart={onTouch}>Touch me</Button>);

        const button = screen.getByRole('button');

        await userEvent.pointer([
            { target: button, keys: '[TouchA>]' },
            { keys: '[/TouchA]' },
        ]);

        expect(onTouch).toHaveBeenCalled();
    });
});
```

### 3. 🎪 Тестирование с контекстом в браузере

```typescript
const createTestWrapper = ({ user = createMockUser(), theme = 'light' } = {}) => {
    return ({ children }: { children: React.ReactNode }) => (
        <AuthProvider user={user}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </AuthProvider>
    );
};

test('должен использовать контекст и применять реальные CSS стили', () => {
    const testUser = createMockUser({ name: 'Browser Test User' });
    render(<UserProfile />, {
        wrapper: createTestWrapper({ user: testUser })
    });

    expect(screen.getByText('Browser Test User')).toBeInTheDocument();

    const profileElement = screen.getByTestId('user-profile');
    const computedStyle = getComputedStyle(profileElement);
    expect(computedStyle.backgroundColor).toBe('rgb(255, 255, 255)');
});
```

### 4. 🔄 Хуки и состояние в браузере

```typescript
import { renderHook, act } from 'vitest-browser-react';

test('должен управлять состоянием счетчика в реальном браузере', async () => {
    const { result } = renderHook(() => useCounter(0));

    expect(result.current.count).toBe(0);
    expect(typeof result.current.increment).toBe('function');

    await act(async () => {
        result.current.increment();
    });

    expect(result.current.count).toBe(1);

    await act(async () => {
        result.current.increment();
        result.current.increment();
    });

    expect(result.current.count).toBe(3);
});

test('должен работать с асинхронными эффектами', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAsyncData('/api/test'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
});
```

### 5. 📱 Адаптивность и viewport в браузере

```typescript
import { page } from '@vitest/browser/context';

test('должен адаптироваться под мобильные устройства', async () => {
    await page.setViewportSize({ width: 375, height: 667 });

    render(<ResponsiveComponent />);

    const component = screen.getByTestId('responsive-element');
    const styles = getComputedStyle(component);

    expect(styles.display).toBe('block');
    expect(styles.fontSize).toBe('14px');

    await page.setViewportSize({ width: 1200, height: 800 });

    await new Promise(resolve => setTimeout(resolve, 100));

    const desktopStyles = getComputedStyle(component);
    expect(desktopStyles.display).toBe('flex');
    expect(desktopStyles.fontSize).toBe('16px');
});
```

### 6. 🎨 CSS и анимации в браузере

```typescript
test('должен корректно обрабатывать CSS анимации', async () => {
    render(<AnimatedButton>Animated</AnimatedButton>);

    const button = screen.getByRole('button');

    const initialStyles = getComputedStyle(button);
    expect(initialStyles.transition).toContain('all 0.3s ease');

    await userEvent.hover(button);

    await new Promise(resolve => setTimeout(resolve, 100));

    const hoverStyles = getComputedStyle(button, ':hover');
    expect(hoverStyles.transform).toBe('scale(1.05)');

    await userEvent.unhover(button);
});
```

<completion_criteria>
Тесты выполняются в реальном браузере, проверяют CSS стили, обрабатывают пользовательские взаимодействия
</completion_criteria>

<exception_handling>
Если браузер не запускается: проверь установку Playwright драйверов
Если getComputedStyle возвращает пустые значения: убедись что CSS загружен
Если userEvent не работает: используй await перед всеми взаимодействиями
</exception_handling>
</browser_testing_instructions>

## 🌐 TIER 5: E2E Automation Patterns

<e2e_instructions>
Для создания E2E тестов с Playwright следуй этим принципам:
**🎯 ЦЕЛЬ E2E тестов:** Проверить работу системы как единого целого глазами пользователя.

### Что тестировать в E2E

**✅ ОБЯЗАТЕЛЬНО:**

- **Критические пути**: регистрация, авторизация, оплата
- **Интеграция с внешними сервисами**: API, платежи, email
- **Кросс-браузерная совместимость**: Chrome, Firefox, Safari
- **Мобильные viewport**: адаптивность, touch события
- **Performance**: загрузка страниц, Core Web Vitals

### 1. 📱 Современные E2E паттерны

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
    test('должен успешно зарегистрировать нового пользователя', async ({ page }) => {
        const userData = {
            email: `test-${Date.now()}@example.com`,
            password: 'SecurePassword123!',
            name: 'Test User',
        };

        await page.goto('/register');

        await page.fill('[data-testid="email"]', userData.email);
        await page.fill('[data-testid="password"]', userData.password);
        await page.fill('[data-testid="name"]', userData.name);

        const responsePromise = page.waitForResponse('/api/users/register');
        await page.click('[data-testid="submit"]');
        const response = await responsePromise;

        expect(response.status()).toBe(201);

        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('[data-testid="welcome"]')).toContainText('Test User');
    });

    test('должен показывать ошибки валидации', async ({ page }) => {
        await page.goto('/register');

        await page.click('[data-testid="submit"]');

        await expect(page.locator('[data-testid="email-error"]')).toContainText('Email обязателен');
        await expect(page.locator('[data-testid="password-error"]')).toContainText(
            'Пароль должен содержать минимум 8 символов',
        );
    });
});

test.describe('Mobile Experience', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('должен корректно работать на мобильных устройствах', async ({ page }) => {
        await page.goto('/');

        await page.click('[data-testid="mobile-menu-toggle"]');
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

        await page.locator('[data-testid="swipeable-card"]').swipe('left');
        await expect(page.locator('[data-testid="next-card"]')).toBeVisible();
    });
});
```

### 3. 🎪 API интеграция

```typescript
test('должен корректно обрабатывать API ошибки', async ({ page }) => {
    await page.route('/api/users/login', (route) => {
        route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Invalid credentials' }),
        });
    });

    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'wrong@email.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="submit"]');

    await expect(page.locator('[data-testid="error"]')).toContainText('Invalid credentials');
});
```

<completion_criteria>
E2E тесты покрывают критические пути, работают на разных устройствах, стабильно проходят
</completion_criteria>

<exception_handling>
Если тест нестабилен: используй `page.waitForResponse()` и `page.waitForLoadState()`
Если элемент не найден: добавь `data-testid` атрибуты вместо CSS селекторов
Если тайм-аут: увеличь время ожидания для медленных операций
</exception_handling>
</e2e_instructions>

## 🚨 TIER 6: Error Prevention & Troubleshooting

<troubleshooting_guidance>
При возникновении проблем с тестами применяй следующие решения:

### ❌ Частые проблемы

1. **Мок объявлен после импорта** - перенеси `vi.mock()` в начало файла
2. **TypeScript не видит мок** - используй `vi.mocked(functionName)`
3. **Моки не сбрасываются** - добавь `vi.clearAllMocks()` в `beforeEach`
4. **Тестирование реализации** - тестируй поведение, не внутреннее состояние
5. **Зависимость от времени** - используй `vi.useFakeTimers()`
6. **Непонятная ошибка теста** - проверь пути в импортах и моках (относительные пути должны быть точными)

### ✅ Решения

```typescript
// Правильный порядок
vi.mock('./userService'); // СНАЧАЛА мок
import { userService } from './userService'; // ПОТОМ импорт

// Типобезопасные моки
const mockUserService = vi.mocked(userService);
mockUserService.getUser.mockResolvedValue(createMockUser());

// Стабильное время
vi.useFakeTimers();
vi.setSystemTime(new Date('2025-01-15'));
```

<completion_criteria>
Все тесты стабильно проходят, моки работают корректно, нет race conditions
</completion_criteria>

<exception_handling>
Если тесты падают только в CI: проверь различия в окружении и зависимостях
Если непонятная ошибка: добавь дополнительные console.log для отладки
Если проблемы с асинхронностью: используй waitFor и правильные матчеры
</exception_handling>
</troubleshooting_guidance>

[REFERENCE-END]
