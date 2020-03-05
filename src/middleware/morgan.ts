import morgan from 'morgan';
import { LOGGER } from '@utils';
import { MORGAN_PATH } from '@config';

export const morganMiddlware = morgan(MORGAN_PATH, {
	stream: {
		write(info: string) {
			LOGGER.info(info);
		}
	}
});
