import { defineEventHandler } from 'h3'
import { SyncableOdooCollection } from '../../utils/SyncableOdooCollection';

export default defineEventHandler(() => new SyncableOdooCollection('events').syncFromOdoo())
