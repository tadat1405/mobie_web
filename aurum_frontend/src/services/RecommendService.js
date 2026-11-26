import axios from "axios";

const baseUrl = () => (import.meta.env.VITE_HT_URL || '').replace(/\/$/, '')

export const isRecommendEnabled = () => Boolean(baseUrl() && import.meta.env.VITE_HT_COUNTER_ID)

export const getSimilarProducts = async (id, limit) => {
    const res = await axios.get(`${baseUrl()}/api/v1/recs/similar/${id}`, {
        params: { counterId: import.meta.env.VITE_HT_COUNTER_ID, n: limit },
        timeout: 5000,
    });
    return res.data
}
