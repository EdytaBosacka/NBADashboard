import axios from "axios"
import { shallowMount } from '@vue/test-utils'
import PlayersList from '@/components/PlayersList.vue'

var MockAdapter = require("axios-mock-adapter");
var mock = new MockAdapter(axios);

describe('PlayersList.vue', () => {
  afterAll(() => mock.restore());
  beforeEach(() => mock.reset());

  it('renders table after getting players list', async () => {
    mock
      .onGet("https://www.balldontlie.io/api/v1/players?page=1&per_page=15")
      .reply(200, {
        data: [{ id: "1", first_name: "John", last_name: "Smith", position: "A", team: { full_name: "Chicago Bulls" } },
        { id: "2", first_name: "Michael", last_name: "Jordan", position: "B", team: { full_name: "Los Angeles Lakers" } },
        { id: "3", first_name: "Henry", last_name: "Keen", position: "C", team: { full_name: "Brooklyn Nets" } },
        { id: "4", first_name: "Kevin", last_name: "Bacon", position: "D", team: { full_name: "Toronto Raptors" } },
        { id: "5", first_name: "Paul", last_name: "Novak", position: "E", team: { full_name: "Phoenix Suns" } }],
        meta: { total_pages: 1 }
      });

    const wrapper = await shallowMount(PlayersList);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$forceUpdate();
    const tableItems = wrapper.findAll('tbody > tr');

    expect(tableItems).toHaveLength(5);
  });

  it('tests table pagination', async () => {
    mock
      .onGet("https://www.balldontlie.io/api/v1/players?page=1&per_page=15")
      .reply(200, {
        data: [{ id: "1", first_name: "John", last_name: "Smith", position: "A", team: { full_name: "Chicago Bulls" } },
        { id: "2", first_name: "Michael", last_name: "Jordan", position: "B", team: { full_name: "Los Angeles Lakers" } },
        { id: "3", first_name: "Henry", last_name: "Keen", position: "C", team: { full_name: "Brooklyn Nets" } },
        { id: "4", first_name: "Kevin", last_name: "Bacon", position: "D", team: { full_name: "Toronto Raptors" } },
        { id: "5", first_name: "Paul", last_name: "Novak", position: "E", team: { full_name: "Phoenix Suns" } }],
        meta: { total_pages: 2 }
      });

    mock
      .onGet("https://www.balldontlie.io/api/v1/players?page=2&per_page=15")
      .reply(200, {
        data: [{ id: "1", first_name: "Christopher", last_name: "Walker", position: "F", team: { full_name: "Brooklyn Nets" } },
        { id: "2", first_name: "Sebastian", last_name: "Jordan", position: "G", team: { full_name: "Los Angeles Lakers" } },
        { id: "3", first_name: "Kim", last_name: "Nakamura", position: "H", team: { full_name: "Brooklyn Nets" } }],
        meta: { total_pages: 2 }
      });

    const wrapper = await shallowMount(PlayersList);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$forceUpdate();
    const nextButton = wrapper.find('.nextButton');
    await nextButton.trigger('click');
    await wrapper.vm.$forceUpdate();
    const tableItems = wrapper.findAll('tbody > tr');

    expect(tableItems).toHaveLength(3);

  });


})
