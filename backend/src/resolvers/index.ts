import { authResolver } from "./auth";
import { devResolvers } from "./devResolvers";


const resolvers: any[] = [authResolver, devResolvers]

const mergedResolvers: Record<string, Object> = {

}

resolvers.forEach(resolver =>
    Object.keys(resolver).forEach(e => {
        if (mergedResolvers[e]) {
            mergedResolvers[e] = {
                ...mergedResolvers[e],
                ...(resolver[e]),
            }
        }else{
            mergedResolvers[e]=resolver[e]
        }
    })
)

console.log(mergedResolvers)

export {
    mergedResolvers
}
