import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { hashpass, comparepass } from "../hashing/hashingPassword"; 
import { signupInput, signinInput } from "@abhinavsahotra/blog-common/dist/SignValidation"

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();

userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if(!success) {
    c.status(411);
    return c.json({ message: 'Invalid input' })
  }
  
  try {
    const finduser = await prisma.user.findFirst({
      where: {
        email: body.email
      },
    });
    if(finduser) {
      c.status(411);
      return c.json({ message: 'User already exists' })
    }

    const userPassword = await hashpass(body.password)
    console.log(userPassword)

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: userPassword
      }
    })
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt: token })

  } catch (error) {
    c.status(403);
    console.log(error)
    return c.text("Error")
  }
})
  
userRouter.post('/signin', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json()
   const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411)
    return c.json({ message: 'Invalid input' })
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    })

    if (!user) {
      c.status(411)
      return c.json({ message: 'User does not exist' })
    }
    
    const checkUser = await comparepass(body.password, user.password);
    if(!checkUser){
      c.status(403)
      return c.json({ message: 'Invalid password' })
    }

    const { password, ...rest } = user;
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)
    return c.json({ jwt: token, user: rest })
    
  } catch (error) {
    return c.status(403);
    }
})
