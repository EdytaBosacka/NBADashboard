<template>
  <img class="nbaLogo" src="@/assets/nba.png"/>
  <h1>NBA players </h1>
  <table class="table table:border secondary-5:border">
    <thead>
      <tr>
        <th v-for="th in tableHeader" :key="th">
          <div class="between:flex center:items">
            <span @click.prevent="sortByColumn(th.name)">
              <span>{{ th.text }}</span>
            
            </span>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="td in tableData" :key="td" @click="goToSelectedPlayer(td.id, td.name, td.surname)">
        <td>{{ td.id }}</td>
        <td>{{ td.name }}</td>
        <td>{{ td.surname }}</td>
        <td>{{ td.position }}</td>
        <td>{{ td.teamName }}</td>
      </tr>
    </tbody>
  </table>

  <div class="pagination">
        <div :class="['nav-item', { 'disabled': currentPage === 1}]">
          <a href="#" class="nav-link" @click.prevent="(currentPage < 1) ? currentPage = 1 : currentPage -= 1, getPlayersList(currentPage)"> &#11164;&nbsp;</a>
        </div>
        <div :class="['nav-item', { 'disabled': currentPage === 1, 'active': currentPage === 1}]">
          <a href="#" class="nav-link" @click.prevent="currentPage = 1, getPlayersList(currentPage)">1 &nbsp;</a>
        </div>
        
        <div v-for="pagi in showPagination" :key="pagi" :class="['nav-item', {'disabled': pagi === '...', 'active': pagi === currentPage}]">
          <a class="nav-link" @click.prevent="getPlayersList(pagi)">{{ pagi }} &nbsp;</a>
        </div>
        
        <div :class="['nav-item', { 'disabled': currentPage === allPages, 'active': currentPage === allPages }]">
          <a href="#" class="nav-link" @click.prevent="currentPage = allPages, getPlayersList(currentPage)">{{allPages}} &nbsp;</a>
        </div>
        <div :class="['nav-item', { 'disabled': currentPage === allPages }]">
          <a href="#" class="nav-link" @click.prevent="(currentPage > allPages) ? currentPage = allPages : currentPage += 1, getPlayersList(currentPage)">&#11166;</a>
        </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, reactive } from "vue";


interface Player {
  id: number;
  name: string;
  surname: string;
  position: string;
  teamName: string;
}

export default defineComponent({
  name: "PlayersList",
  setup() {
    const table = reactive({});
    return {
      table,
    };
  },
  data() {
    return {
      playersList: [] as Player[],
      columns: [
        { name: "id", text: "ID" },
        { name: "name", text: "First Name" },
        { name: "surname", text: "Last Name" },
        { name: "position", text: "Position" },
        { name: "teamName", text: "Team Name" },
      ],
      currentPage: 1 as number,
      allPages: 0 as number
    };
  },
  computed: {
    tableHeader(): Array<any> {
      return this.columns;
    },
    tableData(): Array<any> {
      return this.playersList;
    },
    showPagination() : any[]
    {
      if(this.currentPage === 1)
      {
        return ['...'];
      }
      else if(this.currentPage === 2)
      {
        return [2, '...'];
      }
      else if(this.currentPage === this.allPages)
      {
        return ['...'];
      }
      else if(this.currentPage === (this.allPages - 1))
      {
        return ['...', (this.allPages-1) ]
      }
      else if(this.currentPage >2 && this.currentPage < (this.allPages-1))
      {
        return ['...', this.currentPage, '...'];
      }
      else
      {
        return [];
      }
    },
  },
  methods: {
    getPlayersList(page: number) {
      axios
        .get("https://www.balldontlie.io/api/v1/players?page=" + (page) + "&per_page=15")
        .then(function (response) {
          return {playerList: response.data.data.map((player: any) => ({
            id: player.id,
            name: player.first_name,
            surname: player.last_name,
            position: player.position,
            teamName: player.team.full_name,
            })),
            allPages: response.data.meta.total_pages
          };
        })
        .then((result) => {
          this.playersList = result.playerList;
          this.allPages = result.allPages;
          console.log(this.allPages);
          console.log(result);
        });
    },
    
    goToSelectedPlayer(id: number, name: string, surname:string){
      this.$router.push({ name: 'PlayerStats', params:{ id: id, name: (name + ' ' + surname)}})

    }
  },
  mounted() {
    this.getPlayersList(1);
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: white;
  margin-top: 0px;
  margin-bottom: 8px;
}

.nbaLogo {
  padding: 0px;
  height: 150px;
}

td {
  padding: 10px;
  border: 1px solid black;
  border-collapse: collapse;
}
th {
  padding: 10px;
  border: 1px solid #003366;
  border-collapse: collapse;
  background-color: #9fbbd1;
}
table {
  margin-left: auto;
  margin-right: auto;
  background-color: #e4e9ed;
}

.pagination {
  margin: 5px;
  display:flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.nav-link {
   text-decoration: none;
   color:white;
}

.disabled {
  pointer-events: none;    
}

.active > .nav-link {
  color: #9fbbd1;
  font-weight: bold;
}
</style>
