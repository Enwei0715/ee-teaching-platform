/**
 * Optimistic UI Helper
 * 
 * Provides a pattern for implementing optimistic updates that immediately
 * update the UI before the API call completes.
 */

interface OptimisticUpdate<T> {
    onOptimistic: () => void;
    apiCall: () => Promise<T>;
    onSuccess?: (result: T) => void;
    onError?: (error: any) => void;
    onRevert?: () => void;
}

export async function withOptimisticUpdate<T>({
    onOptimistic,
    apiCall,
    onSuccess,
    onError,
    onRevert
}: OptimisticUpdate<T>) {
    // 1. Immediately update UI (optimistic)
    onOptimistic();

    try {
        // 2. Make API call in background
        const result = await apiCall();

        // 3. Call success handler if provided
        onSuccess?.(result);

        return { success: true, data: result };
    } catch (error) {
        // 4. Revert UI on error
        onRevert?.();

        // 5. Handle error
        onError?.(error);

        return { success: false, error };
    }
}

/**
 * Usage Example:
 * 
 * const handleLike = async () => {
 *     withOptimisticUpdate({
 *         onOptimistic: () => setIsLiked(true),
 *         apiCall: () => fetch('/api/like', { method: 'POST' }),
 *         onRevert: () => setIsLiked(false),
 *         onError: (error) => toast.error('Failed to like')
 *     });
 * };
 */
