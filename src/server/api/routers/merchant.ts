import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { env } from "../../../env.mjs";
import { businessRegisterProcedure } from "../procedures/merchants/businessRegisterProcedure";
import getCurrentMerchantProcedure from "../procedures/merchants/getCurrentMerchantProcedure";
import personalRegisterProcedure from "../procedures/merchants/personalRegisterProcedure";
import crypto from "crypto";

import {
  createTRPCRouter,
  merchantProcedure,
  protectedProcedure,
} from "../trpc";

export const merchantRouter = createTRPCRouter({
  registerBusiness: businessRegisterProcedure,

  registerPersonal: personalRegisterProcedure,

  getCurrentMerchant: getCurrentMerchantProcedure,

  addMenu: merchantProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        price: z.number(),
        establishmentId: z.string(),
        categoryId: z.string(),
        thumbnail: z.string(),
        stock: z.number().optional(),

      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.menuItem.create({
        data: {
          title: input.title,
          description: input.description,
          price: input.price,
          thumbnail: input.thumbnail,
          stock: input.stock,
          establishment: {
            connect: {
              id: input.establishmentId,
            },
          },
          category: {
            connect: {
              id: input.categoryId,
            },
          },
        },
      });
    }),

  editMenu: merchantProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        categoryId: z.string().optional(),
        thumbnail: z.string().optional(),
        stock: z.number().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.menuItem.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          price: input.price,
          thumbnail: input.thumbnail,
          stock: input.stock,
          category: {
            connect: {
              id: input.categoryId,
            },
          },
        },
      });
    }),

  changeStock: merchantProcedure
    .input(z.object({ menuId: z.string(), stock: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.menuItem.update({
        where: {
          id: input.menuId,
        },
        data: {
          stock: input.stock,
        },
      });
    }),

  createCategory: merchantProcedure
    .input(z.object({ title: z.string(), establishmentId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.create({
        data: {
          title: input.title,
          establishment: {
            connect: {
              id: input.establishmentId,
            },
          },
        },
      });
    }),

});
