import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt"

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userId: string;
  }
}>();

// Get the header and verify the token
blogRouter.use('/*', async (c, next) => { 
  try {
    const authHeader = c.req.header('Authorization') || '';
    const response = await verify(authHeader, c.env.JWT_SECRET);
    if (response) {
      c.set('jwtPayload', response.id );
      await next();
    }
  } catch (error) {
    c.status(403);
    return c.json({ message: 'UnAuthorized' });
  }
});

// Create a blog
blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const authorId = c.get("jwtPayload");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(authorId)
        }
    })
    return c.json({
        id: blog.id
    })
})

// Update a blog
blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
    const body = await c.req.json()

    const blog = await prisma.post.update({
      where: {
        id: body.id
      },
      data: {
        title: body.title,
        content: body.content,
      }
    })
    c.status(200)
    return c.json({ id: blog.id });

  } catch (error) {
    c.status(403); 
    console.log(error)
    return c.text("Error while Updating the Blog")
  }
})

// Get all blogs
// we have to add pagination - which means we shouldn't return all the blog
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try{
        const blogs = await prisma.post.findMany({
        select:{
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name:true
                }
            }
        }
    })

    return c.json({
        blogs
    })
    }catch(error){
        console.log(error)
        c.status(411)
        return c.text("Unable to find blogs")
    }
})

// Get blog by id
blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const blog = await prisma.post.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return c.json({
            blog
        })
    } catch(e) {
        c.status(411)
        return c.json({
            message: "Error while fetching blog post"
        })
    }
})

// Delete a blog
blogRouter.delete('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Input validation
    if (!body.id) {
        return c.json({ error: 'Missing required field: id' }, { status: 400 });
    }

    try {
        const blog = await prisma.post.delete({
            where: { 
                id: body.id 
            },
        });

        return c.json({ message: 'Blog post deleted successfully', id: blog.id });
    } catch (error) {
        console.log(error);
        return c.json({ error: 'Blog post deletion failed' }, { status: 500 });
    } 
});

