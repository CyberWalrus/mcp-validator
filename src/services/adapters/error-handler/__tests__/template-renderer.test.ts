import { renderTemplate } from '../helpers/template-renderer';

describe('renderTemplate', () => {
    it('должен заменять простые переменные', () => {
        const template = 'Hello {{name}}, you are {{age}} years old';
        const variables = { age: 25, name: 'John' };

        const result = renderTemplate(template, variables);

        expect(result).toBe('Hello John, you are 25 years old');
    });

    it('должен обрабатывать отсутствующие переменные', () => {
        const template = 'Hello {{name}}, {{missing}} value';
        const variables = { name: 'John' };

        const result = renderTemplate(template, variables);

        expect(result).toBe('Hello John,  value');
    });

    it('должен обрабатывать массивы в секциях', () => {
        const template = 'Items:{{#items}}\n- {{.}}{{/items}}';
        const variables = { items: ['apple', 'banana', 'cherry'] };

        const result = renderTemplate(template, variables);

        expect(result).toBe('Items:\n- apple\n- banana\n- cherry');
    });

    it('должен удалять пустые секции массивов', () => {
        const template = 'Items:{{#items}}\n- {{.}}{{/items}}\nEnd';
        const variables = { items: [] };

        const result = renderTemplate(template, variables);

        expect(result).toBe('Items:\nEnd');
    });

    it('должен обрабатывать отсутствующие массивы как пустые', () => {
        const template = 'Items:{{#missing}}\n- {{.}}{{/missing}}\nEnd';
        const variables = {};

        const result = renderTemplate(template, variables);

        expect(result).toBe('Items:\nEnd');
    });

    it('должен обрабатывать несколько секций в одном шаблоне', () => {
        const template = 'Causes:{{#causes}}\n- {{.}}{{/causes}}\nSolutions:{{#solutions}}\n1. {{.}}{{/solutions}}';
        const variables = {
            causes: ['reason1', 'reason2'],
            solutions: ['fix1', 'fix2'],
        };

        const result = renderTemplate(template, variables);

        expect(result).toBe('Causes:\n- reason1\n- reason2\nSolutions:\n1. fix1\n1. fix2');
    });
});
