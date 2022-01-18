import { shallowMount } from '@vue/test-utils'
import PlayerStats from '@/components/PlayerStats.vue'

describe('PlayerStats.vue', () => {
    it('renders players full name as header', () => {

        const $route = { params: { id: 14, name: 'Ike Anigbogu' } };
        const wrapper = shallowMount(PlayerStats, { global: { mocks: { $route: $route } } });
        const header = wrapper.find('h1');

        expect(header.text()).toBe('Ike Anigbogu');
    });
})
