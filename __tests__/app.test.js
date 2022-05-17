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
    test(`Status:200, responds with an array of 'topic' objects, each with 'slug' and 'description' properties`, () => {
        return request(app)
        .get(`/api/topics`)
        .expect(200)
        .then(({body}) => {
            const topics = body;
            expect(topics).toBeInstanceOf(Array);
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
                expect(topic).toEqual(expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String)
                }))
            })
        });
    })
    test('status:404, responds with an error message when passed a route that does not exist', () => {
        return request(app)
          .get('/api/tropics')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Route does not exist');
          });
      })
});
