/**
 * Copyright 2019, Danang Galuh Tegar Prasetyo.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const Copyright: React.FC = () => (
	<Typography style={{ marginTop: '10px', marginBottom: '30px' }} variant="body2" color="textSecondary" align="center">
		{'© ' + new Date().getFullYear() + ' '}
		<Link color="inherit" href="https:/github.com/danang-id">
			Danang Galuh Tegar Prasetyo
		</Link>{'.'}
	</Typography>
);

export default Copyright;
