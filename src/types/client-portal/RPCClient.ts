
import { supabase } from "@/integrations/supabase/client";
import { ClientPortalRPCFunctions, ClientPortalRPCArgs, ClientPortalRPCReturns } from "./RPCTypes";

// Type-safe wrapper for Supabase RPC calls
export async function clientPortalRPC<T extends ClientPortalRPCFunctions>(
  functionName: T,
  params: ClientPortalRPCArgs<T>
): Promise<{ data: ClientPortalRPCReturns<T> | null; error: any }> {
  // Call the Supabase RPC method but cast the result to the correct type
  const { data, error } = await supabase.rpc(
    functionName as string,
    params as any
  );
  
  return { 
    // Cast the data to the expected return type for this specific function
    data: data as ClientPortalRPCReturns<T>,
    error 
  };
}
