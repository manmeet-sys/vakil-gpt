
import { supabase } from "@/integrations/supabase/client";
import { ClientPortalRPCFunctions, ClientPortalRPCArgs, ClientPortalRPCReturns } from "./RPCTypes";

// Type-safe wrapper for Supabase RPC calls
export async function clientPortalRPC<T extends ClientPortalRPCFunctions>(
  functionName: T,
  params: ClientPortalRPCArgs<T>
): Promise<{ data: ClientPortalRPCReturns<T> | null; error: any }> {
  // Work around TypeScript constraints by using type assertions
  const rpcFunction = functionName as string;
  const rpcParams = params as object;
  
  // Call the Supabase RPC method with the correctly typed parameters
  const { data, error } = await supabase.rpc(rpcFunction, rpcParams);
  
  return { 
    data: data as ClientPortalRPCReturns<T>,
    error 
  };
}
