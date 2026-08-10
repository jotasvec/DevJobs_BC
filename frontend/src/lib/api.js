
export async function api(url, option={}) {
    const res = await fetch(url, {
        credentials: "include",
        ...option
    });

    if(!res.ok) throw new Error(`Fetching error: ${res.statusText}`);
    
    return res.json()
}

export const get = async (url) => api(url)

export const post = async (url, body) => api(url,{
    method: "POST",
    body: JSON.stringify(body),
    headers: {
        "Content-Type": "application/json"
    }
})


export const patch = async (url, data) => api(url,{
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
})
export const put = async (url, data) => api(url,{
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
})

export const del = async (url) => api(url,{
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
})
