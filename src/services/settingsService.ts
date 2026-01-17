import api from '@/lib/axios';
import { UserSettings } from '@/lib/types';

export const SettingsService = {
  /**
   * Updates (or creates) the user settings in the backend.
   * Endpoint: /user-setting/update-user-settings
   */
  async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const { data } = await api.post<UserSettings>('/user-setting/update-user-settings', settings);
    return data;
  },

  /**
   * Fetches the current user settings.
   */
  async getUserSettings(): Promise<UserSettings> {
    const { data } = await api.get<UserSettings>('/user-setting/get-user-settings');
    return data;
  }
};