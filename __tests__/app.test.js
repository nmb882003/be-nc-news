const request = require(`supertest`);
const app = require(`../app.js`);
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');

const testData = require('../db/data/test-data');

afterAll(() => {
    return db.end()
});

beforeEach(() => {
    return seed(testData);
})

describe(`GET /api/topics`, () => {
    test(`Status:200, responds with an array of topic objects, each with 'slug' and 'description' properties`, () => {
        return request(app)
        .get(`/api/topics`)
        .expect(200)
        .then(({body}) => {
            const {topicsArray} = body;
            expect(topicsArray).toBeInstanceOf(Array);
            expect(topicsArray).toHaveLength(3);
            topicsArray.forEach((topic) => {
                expect(topic).toEqual(expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String)
                }))
            })
        });
    })
});

describe(`GET /api/articles/:article_id`, () => {
    test(`status:200, responds with an article object`, () => {
        return request(app)
        .get(`/api/articles/2`)
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article).toBeInstanceOf(Object);
            expect(article).toEqual(expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),  
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number)
            }));
        });
    });
    test(`status: 400, responds with an error message when passed an invalid parameteric endpoint`, () => {
        return request(app)
            .get(`/api/articles/bananas`)
            .expect(400)
            .then(({ body }) => {
            expect(body.msg).toBe('Invalid request');
        });
    });

    test(`status: 404, responds with an error message when passed an article_id that doesn't exist`, () => {
        return request(app)
        .get(`/api/articles/333`)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Entry not found');
        })
    });
});

describe(`GET /*`, () => {
    test('status:404, responds with an error message when passed a route that does not exist', () => {
        return request(app)
        .get('/api/tropics')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Route does not exist');
        });
    });
});