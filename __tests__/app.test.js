const request = require(`supertest`);
const app = require(`../app.js`);
const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');

const testData = require('../db/data/test-data');

beforeEach(() => seed(testData))

afterAll(() => db.end());

describe(`GET /api`, () => {
    test(`Status: 200, responds with a JSON object describing all of the available endpoints on the API`, () => {
        return request(app)
            .get(`/api`)
            .expect(200)
            .then(({ body }) => {
                const { endpointsMap } = body;
                expect(endpointsMap).toBeInstanceOf(Object);
            })
    })
})

describe(`GET /api/topics`, () => {
    test(`Status:200, responds with an array of topic objects, each with 'slug' and 'description' properties`, () => {
        return request(app)
            .get(`/api/topics`)
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
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
});

describe(`GET /api/users`, () => {
    test(`status: 200, responds with an array of objects with a 'username' property`, () => {
        return request(app)
            .get(`/api/users`)
            .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(Array.isArray(users)).toBe(true);
                expect(users).toHaveLength(4);

                users.forEach(user => {
                    expect(user).toEqual(expect.objectContaining({
                        username: expect.any(String),
                    }));
                });
            });
    });
});

describe('GET /api/users/:username', () => {
    test(`status: 200, responds with a user object with 'username', 'avatar_url' and 'name' properties`, () => {
        return request(app)
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(({ body }) => {
                const { user } = body;
                expect(user).toBeInstanceOf(Object);
                expect(Array.isArray(user)).toBe(false);
                expect(user).toEqual(expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                }))
            })
    })
    test(`status: 404, responds with an error message when passed a username that doesn't exist`, () => {
        return request(app)
            .get('/api/users/buttery_fridge')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User not found")
            })
    })
})

describe(`GET /api/articles`, () => {
    test(`status: 200, responds with an array of article objects with 'author', 'title', 'article_id', 'topic', 'created_at', 'votes' and 'comment_count' properties, sorted by date in descending order`, () => {
        return request(app)
            .get(`/api/articles`)
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(articles).toHaveLength(10)
                expect(articles).toBeSortedBy(`created_at`, { descending: true });
                articles.forEach(article => {
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
    test(`status: 200, (refactored) accepts a 'sorted_by' query and responds with an array of article objects sorted by column (defaults to 'created_at')`, () => {
        return request(app)
            .get(`/api/articles?sorted_by=votes`)
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(articles).toHaveLength(10)
                expect(articles).toBeSortedBy(`votes`, { descending: true });
            })
    })
    test(`status: 400, (refactored) responds with an error message when 'sorted_by' query is used with an invalid column name`, () => {
        return request(app)
            .get(`/api/articles?sorted_by=length`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe(`Invalid sort query: 'length' should be a valid column name`);
            })
    })
    test(`status: 200, (refactored) accepts an 'order' query to indicate the sort direction and responds with a sorted array of article objects (defaults to 'desc')`, () => {
        return request(app)
            .get(`/api/articles?order=asc`)
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;

                expect(Array.isArray(articles)).toBe(true);
                expect(articles).toHaveLength(10)
                expect(articles).toBeSortedBy(`created_at`, { descending: false });
            })
    })
    test(`status: 200, (refactored) accepts multiple queries in order to return a sorted array of topics on a particular topic`, () => {
        return request(app)
            .get(`/api/articles?sorted_by=author&order=asc&topic=mitch`)
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(articles).toHaveLength(10)
                expect(articles).toBeSortedBy(`author`, { descending: false });
            })
    })
    test(`status: 400, (refactored) responds with an error message when 'order' query is used with an invalid sort direction`, () => {
        return request(app)
            .get(`/api/articles?order=up`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe(`Invalid order query: should be either 'asc' or 'desc'`);
            })
    })
    test(`status: 200, (refactored) accepts a 'topic' query and responds with an array of article objects matching that topic`, () => {
        return request(app)
            .get(`/api/articles?topic=cats`)
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(articles).toHaveLength(1);

                articles.forEach(article => {
                    expect(article.topic).toBe("cats");
                });
            });
    });
    test(`status: 400, (refactored) returns an error message when passed an invalid 'topic' query`, () => {
        return request(app)
            .get(`/api/articles?topic=enneagram`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe(`Invalid topic query: 'enneagram' should be a valid topic category`);
            })
    })
    test(`status: 404, (refactored) returns an error message when passed an valid 'topic' query but which has no results`, () => {
        return request(app)
            .get(`/api/articles?topic=paper`)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe(`No articles associated with topic 'paper'`);
            })
    })
    test(`status: 200, (refactored) responds with an array of article objects also containing a 'total_count' property`, () => {
        return request(app)
            .get(`/api/articles`)
            .expect(200)
            .then(({body}) => {
                const { articles } = body;

                articles.forEach(article => {
                    expect(article).toEqual(expect.objectContaining({
                        total_count: expect.any(Number)
                    }));
                });
            })
    })
    test(`status: 200, (refactored) accepts a 'limit' query to restrict the number of results returned, defaults to 10`, () => {
        return request(app)
        .get(`/api/articles?limit=8`)
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(Array.isArray(articles)).toBe(true);
            expect(articles).toHaveLength(8);
        })
    })
    test(`status: 200, (refactored) accepts a 'p' query in order to specify the page at which to start (determined by 'limit'), defaults to 1`, () => {
        return request(app)
        .get(`/api/articles?p=2`)
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(Array.isArray(articles)).toBe(true);
            expect(articles).toHaveLength(2);
        })
    })
    test(`status: 400, (refactored) returns an error message when passed an invalid 'p' query`, () => {
        return request(app)
        .get(`/api/articles?p=cats`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid pagination: 'p' and 'limit' queries must be numerical values");
        })
    })
    test(`status: 400, (refactored) returns an error message when passed an invalid 'limit' query`, () => {
        return request(app)
        .get(`/api/articles?p=2&limit=cats`)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid pagination: 'p' and 'limit' queries must be numerical values");
        })
    })

});

describe(`GET /api/articles/:article_id`, () => {
    test(`status:200, responds with an article object`, () => {
        return request(app)
            .get(`/api/articles/2`)
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
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
    test(`status:200, (refactored) responds with an article object also containing a 'comment_count' property`, () => {
        return request(app)
            .get(`/api/articles/1`)
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toBeInstanceOf(Object);
                expect(article).toEqual(expect.objectContaining({
                    comment_count: expect.any(String)
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
                expect(body.msg).toBe('Article not found');
            })
    });
});

describe(`GET /api/articles/:article_id/comments`, () => {
    test(`status: 200, responds with an array of comments for the given article_id, each with 'comment_id', 'votes', 'created_at', 'author' and 'body' properties`, () => {
        return request(app)
            .get(`/api/articles/1/comments`)
            .expect(200)
            .then(({ body }) => {

                const { comments } = body;

                expect(Array.isArray(comments));
                expect(comments).toHaveLength(11);

                comments.forEach(comment => {
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
    test(`status: 404, responds with an error message when passed a valid endpoint where the resource doesn't exist`, () => {
        return request(app)
            .get(`/api/articles/333/comments`)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe(`Article not found`);
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

describe('POST /api/articles', () => {
    const validBody = {
        author: 'icellusedkars',
        title: 'This is a cool title',
        body: 'This is the most interesting article you will ever read.',
        topic: 'paper'
    };

    const invalidBody = {
        author: 'icellusedkars',
        title: 'The Mystery of the Missing Body',
        topic: 'paper'
    };

    const invalidBody2 = {
        author: 'icellusedkars',
        title: 3454432,
        body: 'The humble title\'s days are numbered, in my opinion',
        topic: 'paper'
    }

    const invalidBody3 = {
        author: 'ismelluserkars',
        title: 'The Banana Stand',
        body: 'There is always money in the banana stand, or SO THEY WANT YOU TO THINK!!',
        topic: 'paper'
    }

    const invalidBody4 = {
        author: 'icellusedkars',
        title: 'This is outrageous',
        body: 'I am so outraged I can barely contain myself',
        topic: 'politics'
    }

    test('status: 201, responds with the posted article', () => {
        return request(app)
            .post('/api/articles')
            .send(validBody)
            .expect(201)
            .then(({ body }) => {
                const { postedArticle } = body;
                expect(postedArticle).toBeInstanceOf(Object);
                expect(postedArticle).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    body: expect.any(String),
                    topic: expect.any(String),
                    article_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    comment_count: expect.any(Number)
                }))
            })
    })

    test(`status: 400, responds with an error message if body is missing either 'author', 'title', 'body' or 'topic' properties`, () => {
        return request(app)
            .post('/api/articles')
            .send(invalidBody)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request");
            })
    })

    test(`status: 400, responds with an error message when passed a body in which 'author', 'title', 'body' or 'topic' properties are not a string`, () => {
        return request(app)
            .post('/api/articles')
            .send(invalidBody2)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request");
            })
    })

    test(`status: 400, responds with an error message when passed a body in which 'author' property is not an existing user`, () => {
        return request(app)
            .post('/api/articles')
            .send(invalidBody3)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request - author not found in users");
            })
    })

    test(`status: 400, responds with an error message when passed a body in which 'topic' is not an existing topic`, () => {
        return request(app)
            .post('/api/articles')
            .send(invalidBody4)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request - topic not found in topics");
            })
    })
})

describe(`POST /api/articles/:article_id/comments`, () => {

    const validBody = { username: "butter_bridge", post: "I'm outraged by this! It's political correctness gone mad, I tell you!" };
    const invalidBody = { post: "Down with this kind of thing!!!" };
    const invalidBody2 = { username: "butter_bridge", favourite_colour: "yellow" };
    const invalidBody3 = { username: 616, post: "The sink is full of fishes, she's got dirty dishes on the brain" };
    const invalidBody4 = { username: "butter_bridge", post: 8008569696969 };
    const invalidBody5 = { username: "G.O.B.", post: "I've made a huge mistake" };

    test(`status: 201, responds with the posted comment object`, () => {
        return request(app)
            .post(`/api/articles/1/comments`)
            .send(validBody)
            .expect(201)
            .then(({ body }) => {
                const { postedComment } = body;
                expect(postedComment).toBeInstanceOf(Object);
                expect(postedComment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    body: validBody.post,
                    article_id: 1,
                    author: validBody.username,
                    created_at: expect.any(String),
                    votes: 0
                }));
            })
    })
    test(`status: 400, responds with an error when passed an object without a 'username' property`, () => {
        return request(app)
            .post(`/api/articles/1/comments`)
            .send(invalidBody)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid request');
            })
    })
    test(`status: 400, responds with an error when passed an object without a 'post' property`, () => {
        return request(app)
            .post(`/api/articles/1/comments`)
            .send(invalidBody2)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid request');
            })
    })
    test(`status: 400, responds with an error message when passed an object where the 'username' property is not a string`, () => {
        return request(app)
            .post(`/api/articles/1/comments`)
            .send(invalidBody3)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid request');
            })
    });
    test(`status: 400, responds with an error message when passed an object where the 'post' property is not a string`, () => {
        return request(app)
            .post(`/api/articles/1/comments`)
            .send(invalidBody4)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid request');
            })
    });
    test(`status: 400, responds with an error message when passed an object where the 'username' property is not an existing user`, () => {
        return request(app)
            .post(`/api/articles/1/comments`)
            .send(invalidBody5)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid request - username not found');
            })
    });
    test(`status: 400, responds with an error message when passed an invalid parametric endpoint`, () => {
        return request(app)
            .post(`/api/articles/bananas/comments`)
            .send(validBody)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid request');
            })
    })
    test(`status: 404, responds with an error message when passed a valid endpoint where the resource doesn't exist`, () => {
        return request(app)
            .post(`/api/articles/222/comments`)
            .send(validBody)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            })
    })
})

describe(`PATCH /api/articles/:article_id`, () => {
    const validBody = { inc_votes: 10 };
    const invalidBody1 = { inc_bananas: 10 };
    const invalidBody2 = { inc_votes: "ten" };

    test(`status: 200, responds with an updated article object when passed an object with a valid 'inc_votes' property`, () => {
        return request(app)
            .patch(`/api/articles/1`)
            .send(validBody)
            .expect(200)
            .then(({ body }) => {
                const { updatedArticle } = body;
                expect(updatedArticle).toBeInstanceOf(Object);
                expect(updatedArticle).toEqual(expect.objectContaining({
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
                expect(body.msg).toBe('Article not found');
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

describe(`PATCH /api/comments/:comment_id`, () => {
    const validBody = { inc_votes: 10 };
    const invalidBody1 = { inc_bananas: 10 };
    const invalidBody2 = { inc_votes: "ten" };

    test(`status: 200, responds with an updated comment object when passed an object with a valid 'inc_votes' property`, () => {
        return request(app)
            .patch('/api/comments/1')
            .send(validBody)
            .expect(200)
            .then(({ body }) => {
                const { updatedComment } = body;
                expect(updatedComment).toBeInstanceOf(Object);
                expect(updatedComment).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    article_id: expect.any(Number),
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: 26
                }))
            })
    })
    test(`status: 400, responds with an error message when passsed a body object without an 'inc_votes' property`, () => {
        return request(app)
            .patch('/api/comments/1')
            .send(invalidBody1)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request");
            })
    })
    test(`status: 400, responds with an error message when passed a body object in which 'inc_votes' is not a number`, () => {
        return request(app)
            .patch('/api/comments/1')
            .send(invalidBody2)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request");
            })
    })
    test(`status: 400, responds with an error message when passed an invalid parametric endpoint`, () => {
        return request(app)
            .patch('/api/comments/bananas')
            .send(validBody)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid request")
            })
    })
    test(`status: 404, responds with an error message when passed a parmetric endpoint which is valid but not known`, () => {
        return request(app)
            .patch('/api/comments/666')
            .send(validBody)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment not found");
            })
    })
})

describe(`DELETE /api/comments/:comment_id`, () => {
    test(`status: 204, responds with no content`, () => {
        return request(app)
            .delete(`/api/comments/7`)
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({});
            })
    })
    test(`status: 400, resonds with an error message when an invalid parametric endpoint is used`, () => {
        return request(app)
            .delete(`/api/comments/bananas`)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toEqual("Invalid request");
            })
    })
    test(`status: 404, responds with an error when passed a comment_id that doesn't exist`, () => {
        return request(app)
            .delete(`/api/comments/333`)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toEqual("Comment not found")
            })
    })
})