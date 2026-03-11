import { query } from "./_generated/server";

export const counts = query({
    args: {},
    handler: async (ctx) => {
        const articles = await ctx.db.query("articles").collect();
        const blogs = await ctx.db.query("blogs").collect();
        const news = await ctx.db.query("news").collect();
        const timelineEvents = await ctx.db.query("timelineEvents").collect();
        
        return {
            articles: articles.length,
            blogs: blogs.length,
            news: news.length,
            timelineEvents: timelineEvents.length,
            articleTitles: articles.map(a => a.title),
            blogTitles: blogs.map(b => b.title),
            newsHeadlines: news.map(n => n.headline),
        };
    }
});
