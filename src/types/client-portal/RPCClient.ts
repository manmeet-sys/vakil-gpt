
import { supabase } from "@/integrations/supabase/client";
import { ClientPortalRPCFunctions, ClientPortalRPCArgs, ClientPortalRPCReturns } from "./RPCTypes";

// Type-safe wrapper for Supabase RPC calls
export async function clientPortalRPC<T extends ClientPortalRPCFunctions>(
  functionName: T,
  params: ClientPortalRPCArgs<T>
): Promise<{ data: ClientPortalRPCReturns<T> | null; error: any }> {
  // Call the Supabase RPC method without generic type parameters
  // Use type assertions instead to maintain type safety
  const { data, error } = await supabase.rpc(
    functionName as any,
    params as any
  );
  
  return { 
    // Cast the data to the expected return type for this specific function
    data: data as ClientPortalRPCReturns<T>,
    error 
  };
}
