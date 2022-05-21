const request = require(`supertest`);
const app = require(`../app.js`);
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');

const testData = require('../db/data/test-data');

beforeEach(() => seed(testData))

afterAll(() => db.end());

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
    test(`status:200, responds with an article object also containing a 'comment_count' property`, () => {
        return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then(({body}) => {
            const {article} = body;
            expect(article).toBeInstanceOf(Object);
            expect(article).toEqual(expect.objectContaining({
                comment_count: "11"
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

describe(`PATCH /api/articles/:article_id`, () => {
    const validBody = { inc_votes: 10 };
    const invalidBody1 = { inc_bananas: 10 };
    const invalidBody2 = { inc_votes: "ten" };

    test(`status: 200, responds with an updated article object when passed an object with a valid 'inc_votes' property`, () => {    
        return request(app)
        .patch(`/api/articles/1`)
        .send(validBody)
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
                votes: 110
            }));
        });
    });
    test(`status: 400, responds with an error message when passed an invalid parameteric endpoint`, () => {
        return request(app)
            .patch(`/api/articles/bananas`)
            .send(validBody)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid request');
            });
    });
    test(`status: 404, responds with an error message when passed an article_id that doesn't exist`, () => {
        return request(app)
        .patch(`/api/articles/333`)
        .send(validBody)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Entry not found');
        })
    });
    test(`status: 400, responds with an error message when passed an object without a 'inc_votes' property`, () => {
        return request(app)
        .patch(`/api/articles/1`)
        .send(invalidBody1)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid request');
        })

    });
    test(`status: 400, responds with an error message when passed an object where the 'inc_votes' property is not a number`, () => {
        return request(app)
        .patch(`/api/articles/1`)
        .send(invalidBody2)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid request');
        })

    });
});

describe(`GET /api/users`, () => {
    test(`status: 200, responds with an array of objects with a 'username' property`, () => {
        return request(app)
        .get(`/api/users`)
        .expect(200)
        .then(({body}) => {
            const {usersArray} = body;
            expect(Array.isArray(usersArray)).toBe(true);
            expect(usersArray).toHaveLength(4);
            
            usersArray.forEach(user => {
                expect(user).toEqual(expect.objectContaining({
                    username: expect.any(String),
                }));
            });
        });
    });
});

describe(`GET /api/articles`, () => {
    test(`status: 200, responds with an array of article objects with 'author', 'title', 'article_id', 'topic', 'created_at', 'votes' and 'comment_count' properties`, () => {
        return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then(({body}) => {
            const { articlesArray } = body; 
            expect(Array.isArray(articlesArray)).toBe(true);
            expect(articlesArray).toHaveLength(12)
            expect(articlesArray).toBeSortedBy(`created_at`, { descending: true });

            articlesArray.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),  
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                }));
            });
        })
    })
})

describe(`GET /api/articles/:article_id/comments`, () => {
    test(`status: 200, responds with an array of comments for the given article_id, each with 'comment_id', 'votes', 'created_at', 'author' and 'body' properties`, () => {
        return request(app)
        .get(`/api/articles/1/comments`)
        .expect(200)
        .then(({body}) => {

            const { commentsArray } = body;

            expect(Array.isArray(commentsArray));
            expect(commentsArray).toHaveLength(11);
            
            commentsArray.forEach(comment => {
                expect(comment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String)
                }));
            });
        });
    })

    test(`status: 400, responds with an error message when passed an invalid parameteric endpoint`, () => {
        return request(app)
            .get(`/api/articles/bananas/comments`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe(`Invalid request`);
             });
    });

    test(`status: 404, responds with an error message when passed an entry that doesn't exist`, () => {
        return request(app)
            .get(`/api/articles/333/comments`)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe(`Entry not found`);
            });
    })
})

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