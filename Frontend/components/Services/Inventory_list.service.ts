export interface InventoryItem {
    id: number;
    name: string;
    quantity: string;
    brand: string | null;
}

export interface InventoryList {
    id: number;
    name: string;
    purpose: string;
    inventory_items: InventoryItem[];
    created_at: string;
}

export interface InventoryListResponse {
    count: number;
    inventory_lists: InventoryList[];
}

class InventoryListService {
	public async get_inventory_lists(): Promise<InventoryListResponse> {
		return fetch(
			process.env.NEXT_PUBLIC_BACKEND_URI! +
				"/api/" +
				`inventory-lists-all/`
		)
			.then((res) => res.json());
	}
}

export default new InventoryListService();