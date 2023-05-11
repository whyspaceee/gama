import { customerRegisterProcedure } from "../procedures/customer/customerRegisterProcedure";
import { getEstablishmentByIdQuery } from "../procedures/customer/getEstablishmentByIdQuery";
import { getNearestEstablishmentsQuery } from "../procedures/customer/getNearestEstablishmentsQuery";
import { getEstablishmentCartQuery, updateEstablishmentCartMutation } from "../procedures/customer/getSetCardProcedure";
import { searchEstablishmentsAndMenusQuery } from "../procedures/customer/searchEstablishmentsAndMenusQuery";
import { createTRPCRouter } from "../trpc";
import { getPromosFromEstablishment, updateCartPromos } from "../procedures/customer/promosQuery";

export const customerRouter = createTRPCRouter({
    customerRegister : customerRegisterProcedure,
    getNearestEstablishments : getNearestEstablishmentsQuery,
    getEstablishmentById: getEstablishmentByIdQuery,
    searchEstablishmentAndMenus: searchEstablishmentsAndMenusQuery,
    getEstablishmentCart: getEstablishmentCartQuery,
    updateEstablishmentCart: updateEstablishmentCartMutation,
    getPromosFromEstablishment: getPromosFromEstablishment,
    updateCartPromos: updateCartPromos
})
