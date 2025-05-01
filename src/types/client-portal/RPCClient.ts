
import { supabase } from "@/integrations/supabase/client";
import { ClientPortalRPCFunctions, ClientPortalRPCArgs, ClientPortalRPCReturns } from "./RPCTypes";

// Type-safe wrapper for Supabase RPC calls
export async function clientPortalRPC<T extends ClientPortalRPCFunctions>(
  functionName: T,
  params: ClientPortalRPCArgs<T>
): Promise<{ data: ClientPortalRPCReturns<T> | null; error: any }> {
  // Call the Supabase RPC method with type casting
  // We need to cast the function name and params to string and object respectively
  // to avoid TypeScript errors with the generic constraints
  const { data, error } = await supabase.rpc(
    functionName as string, 
    params as object
  );
  
  return { 
    // Cast the data to the expected return type for this specific function
    data: data as ClientPortalRPCReturns<T>,
    error 
  };
}
