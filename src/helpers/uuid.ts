import UUIDv1 from 'uuid/v1';
import SUUID from 'short-uuid';

export class UUID {
	private static get translator() {
		return SUUID();
	}

	public static generate(): RegularUUID {
		return UUIDv1();
	}

	public static regularToShort(regularUUID: RegularUUID): ShortUUID {
		return UUID.translator.fromUUID(regularUUID);
	}

	public static shortToRegular(shortUUID: ShortUUID): RegularUUID {
		return UUID.translator.toUUID(shortUUID);
	}

	public static generateShort(): ShortUUID {
		return UUID.regularToShort(UUID.generate());
	}

	public static transformIdentifierToRegular(object: { [key: string]: any }): any {
		for (const key in object) {
			if (object.hasOwnProperty(key) && key.substring(key.length - 3) === '_id') {
				try {
					if (key !== 'old_id') {
						object[key] = UUID.shortToRegular(object[key]);
					}
				} catch (error) {
					// Intentionally empty
				}
			}
		}
		return object;
	}

	public static transformIdentifierToShort(object: { [key: string]: any }): any {
		for (const key in object) {
			if (object.hasOwnProperty(key) && key.substring(key.length - 3) === '_id') {
				try {
					if (key !== 'old_id') {
						object[key] = UUID.regularToShort(object[key]);
					}
				} catch (error) {
					// Intentionally empty
				}
			}
		}
		return object;
	}
}

type ShortUUID = string;
type RegularUUID = string;

export default UUID;
