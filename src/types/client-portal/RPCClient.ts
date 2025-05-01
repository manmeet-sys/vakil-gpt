
import { supabase } from "@/integrations/supabase/client";
import { ClientPortalRPCFunctions, ClientPortalRPCArgs, ClientPortalRPCReturns } from "./RPCTypes";

// Type-safe wrapper for Supabase RPC calls
export async function clientPortalRPC<T extends ClientPortalRPCFunctions>(
  functionName: T,
  params: ClientPortalRPCArgs<T>
): Promise<{ data: ClientPortalRPCReturns<T> | null; error: any }> {
  // Use the Supabase rpc method with correct type parameters
  const { data, error } = await supabase.rpc(
    functionName as string,
    params as object
  );
  
  return { 
    data: data as ClientPortalRPCReturns<T>,
    error 
  };
}
