const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    const listWithTwoBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 12,
            __v: 0
        }
    ]

    test('of empty list is zero', () => {
        assert.strictEqual(listHelper.totalLikes([]), 0);
    });

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    });

    test('of a bigger list is calculated rigth', () => {
        assert.strictEqual(listHelper.totalLikes(listWithTwoBlogs), 17);
    });
});

describe('favorite blog', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    const listWithTwoBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 12,
            __v: 0
        }
    ]

    test('of empty list is null', () => {
        assert.strictEqual(listHelper.favorite([]), null);
    });

    test('when list have one blog, equals that blog', () => {
        assert.strictEqual(listHelper.favorite(listWithOneBlog), listWithOneBlog[0]);
    });

    test('of a bigger list is calculated right', () => {
        assert.strictEqual(listHelper.favorite(listWithTwoBlogs), listWithTwoBlogs[1]);
    });
});

describe('most blogs', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'a',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]


    const listWithALotOfBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'pepe',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 12,
            __v: 0
        }
    ];

    test('of empty list is null', () => {
        assert.deepStrictEqual(listHelper.mostBlogs([]), null);
    });

    test('of list with one blog is the author', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {author: 'a', blogs: 1});
    });

    test('of a bigger list is calculated right', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(listWithALotOfBlogs), {author:'Edsger W. Dijkstra', blogs: 2});
    });
});

describe('most likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'a',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    const listWithALotOfBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'pepe',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 12,
            __v: 0
        }
    ];

    test('of empty list is null', () => {
        assert.deepStrictEqual(listHelper.mostLikes([]), null);
    });

    test('of list with one blog is the author', () => {
        assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {author: 'a', likes: 5});
    });

    test('of a bigger list is calculated right', () => {
        assert.deepStrictEqual(listHelper.mostLikes(listWithALotOfBlogs), {author:'Edsger W. Dijkstra', likes: 17});
    });
});
