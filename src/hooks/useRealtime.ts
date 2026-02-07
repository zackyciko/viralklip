"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface RealtimeOptions {
    table: string;
    event?: "INSERT" | "UPDATE" | "DELETE" | "*";
    filter?: string;
    onInsert?: (payload: any) => void;
    onUpdate?: (payload: any) => void;
    onDelete?: (payload: any) => void;
    onChange?: (payload: any) => void;
}

export function useRealtime(options: RealtimeOptions) {
    useEffect(() => {
        const supabase = createClient();
        let channel: RealtimeChannel;

        const subscribe = async () => {
            // Create channel
            channel = supabase.channel(`realtime:${options.table}`);

            // Build subscription
            let subscription = channel.on(
                "postgres_changes",
                {
                    event: options.event || "*",
                    schema: "public",
                    table: options.table,
                    filter: options.filter,
                },
                (payload) => {
                    // Call appropriate handler
                    if (payload.eventType === "INSERT" && options.onInsert) {
                        options.onInsert(payload.new);
                    } else if (payload.eventType === "UPDATE" && options.onUpdate) {
                        options.onUpdate(payload.new);
                    } else if (payload.eventType === "DELETE" && options.onDelete) {
                        options.onDelete(payload.old);
                    }

                    // Call generic onChange handler
                    if (options.onChange) {
                        options.onChange(payload);
                    }
                }
            );

            // Subscribe
            subscription.subscribe();
        };

        subscribe();

        // Cleanup
        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [options.table, options.event, options.filter]);
}

// Example usage:
// useRealtime({
//   table: "projects",
//   filter: `user_id=eq.${userId}`,
//   onUpdate: (project) => {
//     console.log("Project updated:", project);
//     // Update UI
//   },
// });
