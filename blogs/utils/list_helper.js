const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.reduce((sum, val) => {
        return sum + val.likes;
    }, 0);
};

const favorite = (blogs) => {
    if(blogs.length === 0) return null;
    return blogs.reduce((accumulator, value) => {
        return value.likes > accumulator.likes ? value : accumulator;
    }, blogs[0]);
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) return null;
    let authors = {};
    blogs.forEach(blog => {
        if(!(blog.author in authors)){
            authors[blog.author] = 0;
        }
        authors[blog.author]++;
    });
    const most = {author: null, blogs: -1};
    for (const [key, value] of Object.entries(authors)){
        if(value > most.blogs){
            most.author = key;
            most.blogs = value;
        }
    }
    return most;
}

const mostLikes = (blogs) => {
    if(blogs.length === 0) return null;
    let authors = {};
    blogs.forEach(blog => {
        if(!(blog.author in authors)){
            authors[blog.author] = 0;
        }
        authors[blog.author] += blog.likes;
    });
    const most = {author: null, likes: -1};
    for (const [key, value] of Object.entries(authors)){
        if(value > most.likes){
            most.author = key;
            most.likes = value;
        }
    }
    return most;
}

module.exports = {
    dummy,
    totalLikes,
    favorite,
    mostBlogs,
    mostLikes
};