import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
  TextInput, // NOVO: Importado para o formulário
} from 'react-native';

// --- Paleta de Cores Definida ---
const COLORS = {
  azulCalmo: '#2D9CDB',
  verdeEsperanca: '#27AE60',
  amareloSuave: '#F2C94C',
  cinzaClaro: '#F2F2F2',
  preto: '#333333',
  branco: '#FFFFFF',
  vermelhoAlerta: '#EB5757',
};

// --- Dados Simulado (Mock Data) - Belo Horizonte ---
const MOCK_SERVICOS = [
  { id: '1', categoria: 'Alimentação', nome: 'Restaurante Popular I', endereco: 'Av. Contorno, 11484 - Centro, Belo Horizonte', fone: '(31) 3277-6969', icone: '🍲' },
  { id: '2', categoria: 'Abrigo', nome: 'Albergue Municipal Tia Branca', endereco: 'Rua Conselheiro Rocha, 351 - Floresta, Belo Horizonte', fone: '(31) 3277-4999', icone: '🏠' },
  { id: '3', categoria: 'Saúde', nome: 'Centro de Saúde Savassi', endereco: 'R. Paraíba, 890 - Savassi, Belo Horizonte', fone: '(31) 3277-7722', icone: '🩺' },
  { id: '4', categoria: 'Emprego', nome: 'CRAS Vila Marçola', endereco: 'R. Engenheiro Lucas Júlio de Proença, 73 - Serra, Belo Horizonte', fone: '(31) 3277-4300', icone: '👔' },
  { id: '5', categoria: 'Educação', nome: 'Biblioteca Pública Estadual', endereco: 'Praça da Liberdade, 21 - Savassi, Belo Horizonte', fone: '(31) 3269-1166', icone: '📚' },
];

const MOCK_EVENTOS = [
  { id: '1', titulo: 'Feirão de Emprego - Praça da Estação', data: '30/10 - 09h', desc: 'Leve seu currículo e documentos. Diversas vagas disponíveis.' },
  { id: '2', titulo: 'Campanha de Vacinação (Gripe)', data: '01/11 - 10h às 16h', desc: 'No Centro de Saúde Savassi (ver catálogo).' },
  { id: '3', titulo: 'Distribuição de Cestas Básicas', data: '02/11 - 08h', desc: 'Local: Albergue Tia Branca. Necessário cadastro prévio.' },
];


// --- Componente Principal do App ---
export default function App() {
  // Estado para controlar a tela atual (simulando navegação)
  const [telaAtual, setTelaAtual] = useState('BOAS_VINDAS'); // BOAS_VINDAS, DASHBOARD, MAPA, CATALOGO, CHAT, EVENTOS, PERFIL, CADASTRO (NOVO)
  const [perfilUsuario, setPerfilUsuario] = useState(null); // 'NECESSITA_APOIO', 'OFERECE_APOIO'
  
  // Estado para o Modal de Acessibilidade
  const [modalAcessibilidadeVisivel, setModalAcessibilidadeVisivel] = useState(false);

  // --- Estados para o formulário de cadastro (NOVOS) ---
  const [nomeCadastro, setNomeCadastro] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [enderecoCadastro, setEnderecoCadastro] = useState('');
  

  // --- Funções de Navegação ---
  
  const selecionarPerfil = (perfil) => {
    setPerfilUsuario(perfil);
    setTelaAtual('DASHBOARD');
  };

  const navegarPara = (tela) => {
    setTelaAtual(tela);
  };

  // --- Funções de Ação Simuladas ---
  
  const simularAcao = (titulo, mensagem) => {
    // Usando o Alert nativo do React Native
    Alert.alert(titulo, mensagem);
  };

  // --- Componentes de Tela (Render Functions) ---

  // Tela 1: Boas-Vindas
  const renderBoasVindas = () => (
    <View style={[styles.container, { justifyContent: 'center', backgroundColor: COLORS.azulCalmo }]}>
      <Text style={styles.tituloApp}>Conecta+</Text>
      <Text style={styles.subtituloApp}>Você não está sozinho. Estamos juntos.</Text>
      
      <View style={styles.cardEscolha}>
        <Text style={styles.tituloCard}>Como podemos ajudar?</Text>
        <TouchableOpacity
          style={[styles.botaoPrincipal, { backgroundColor: COLORS.verdeEsperanca }]}
          onPress={() => selecionarPerfil('NECESSITA_APOIO')}
          accessibilityRole="button"
          accessibilityLabel="Preciso de apoio. Toque para continuar."
        >
          <Text style={styles.textoBotaoPrincipal}>Preciso de apoio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.botaoSecundario]}
          // NOVO: Alterado para navegar para o cadastro
          onPress={() => navegarPara('CADASTRO')} 
          accessibilityRole="button"
          accessibilityLabel="Quero oferecer apoio. Toque para se cadastrar."
        >
          <Text style={styles.textoBotaoSecundario}>Quero oferecer apoio</Text>
        </TouchableOpacity>
      </View>
      
      {/* Botão de Acessibilidade Fixo */}
      <BotaoAcessibilidade onPress={() => setModalAcessibilidadeVisivel(true)} />
    </View>
  );

  // Tela 2: Dashboard (Menu Principal)
  const renderDashboard = () => (
    <View style={styles.container}>
      <Text style={styles.tituloPagina}>Olá! O que você busca?</Text>
      <ScrollView contentContainerStyle={styles.gridDashboard}>
        <CartaoDashboard icone="🗺️" titulo="Serviços próximos" onPress={() => navegarPara('MAPA')} cor={COLORS.azulCalmo} />
        {/* NOVO: Adicionado link para Catálogo no Dashboard */}
        <CartaoDashboard icone="📚" titulo="Catálogo de Serviços" onPress={() => navegarPara('CATALOGO')} cor={COLORS.verdeEsperanca} />
        <CartaoDashboard icone="💬" titulo="Chat de Apoio" onPress={() => navegarPara('CHAT')} cor={COLORS.amareloSuave} />
        <CartaoDashboard icone="📅" titulo="Eventos e Vagas" onPress={() => navegarPara('EVENTOS')} cor={COLORS.azulCalmo} />
        <CartaoDashboard icone="📢" titulo="Alertas Urgentes" onPress={() => simularAcao('Alertas', 'Nenhum alerta urgente no momento.')} cor={COLORS.vermelhoAlerta} />
        <CartaoDashboard icone="⚙️" titulo="Perfil e Ajustes" onPress={() => navegarPara('PERFIL')} cor={'#8E44AD'} />
      </ScrollView>
      <TouchableOpacity 
        style={[styles.cardOpcao, {marginTop: 20, borderColor: COLORS.vermelhoAlerta, backgroundColor: '#FFF0F0'}]}
        onPress={() => {
          setPerfilUsuario(null);
          navegarPara('BOAS_VINDAS');
        }}
      >
        <Text style={[styles.textoOpcao, {color: COLORS.vermelhoAlerta}]}>Sair</Text>
      </TouchableOpacity>
    </View>
  );

  // Tela 3: Mapa (Simulação)
  const renderMapa = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('DASHBOARD')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Mapa de Serviços</Text>
      <View style={styles.mapaPlaceholder}>
        <Text style={styles.mapaPlaceholderTexto}>[Simulação de Mapa]</Text>
        <Text style={{textAlign: 'center', marginTop: 10, color: COLORS.preto, paddingHorizontal: 10}}></Text>
      </View>
      <View style={styles.filtrosMapa}>
        <TouchableOpacity style={styles.chipFiltro}><Text style={styles.chipTexto}>🍲 Alimentação</Text></TouchableOpacity>
        <TouchableOpacity style={styles.chipFiltro}><Text style={styles.chipTexto}>🏠 Abrigo</Text></TouchableOpacity>
        <TouchableOpacity style={styles.chipFiltro}><Text style={styles.chipTexto}>🩺 Saúde</Text></TouchableOpacity>
      </View>
    </View> // <-- CORREÇÃO: Fechamento correto da View do renderMapa
  );

  // Tela 4: Catálogo de Serviços
  // CORREÇÃO: Movida para fora do renderMapa e sintaxe corrigida de () = ( para () => (
  const renderCatalogo = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('DASHBOARD')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Catálogo de Apoio</Text>
      <ScrollView>
        {MOCK_SERVICOS.map(servico => (
          <View key={servico.id} style={styles.cardCatalogo}>
            <Text style={styles.iconeCard}>{servico.icone}</Text>
            <View style={styles.infoCard}>
              <Text style={styles.tituloCardCatalogo}>{servico.nome}</Text>
              <Text style={styles.textoCardCatalogo}>{servico.categoria}</Text>
              <Text style={styles.textoCardCatalogo}>{servico.endereco}</Text>
            </View>
            <TouchableOpacity 
              style={styles.botaoContato}
              onPress={() => simularAcao('Contato', `Ligando para ${servico.nome}... (Simulação)`)}
              accessibilityLabel={`Ligar para ${servico.nome}`}
            >
              <Text style={styles.textoBotaoContato}>📞</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Tela 5: Chat (Simulação)
  const renderChat = () => (
    <View style={[styles.container, {paddingBottom: 80}]}>
      <BotaoVoltar onPress={() => navegarPara('DASHBOARD')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Chat de Apoio</Text>
      <ScrollView style={styles.chatContainer}>
        <Text style={styles.chatMensagem}>🤖 Olá! Eu sou o assistente virtual do Conecta+. Como posso ajudar?</Text>
        <Text style={styles.chatMensagem}>🤖 Você pode perguntar sobre:{"\n"}1. Onde encontrar abrigos?{"\n"}2. Como conseguir cesta básica?</Text>
        <Text style={[styles.chatMensagem, styles.chatMensagemUsuario]}>Onde encontro abrigos?</Text>
        <Text style={styles.chatMensagem}>🤖 Buscando abrigos próximos... Encontrei o "Albergue Municipal Tia Branca". Veja no catálogo para mais detalhes.</Text>
      </ScrollView>
      <View style={styles.chatInputContainer}>
        {/* Simulação de Input */}
        <Text style={[styles.input, { flex: 1, color: '#999', paddingTop: 14}]}>Digite sua mensagem...</Text>
        <TouchableOpacity><Text style={styles.chatEnviar}>Enviar</Text></TouchableOpacity>
      </View>
    </View>
  );

  // Tela 6: Eventos e Oportunidades
  const renderEventos = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('DASHBOARD')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Eventos e Oportunidades</Text>
      <ScrollView>
        {MOCK_EVENTOS.map(evento => (
          <View key={evento.id} style={styles.cardEvento}>
            <Text style={styles.tituloCardEvento}>{evento.titulo}</Text>
            <Text style={styles.dataCardEvento}>{evento.data}</Text>
            <Text style={styles.textoCardEvento}>{evento.desc}</Text>
            <TouchableOpacity 
              style={styles.botaoParticipar}
              onPress={() => simularAcao('Participar', `Você será lembrado do evento: ${evento.titulo}`)}
            >
              <Text style={styles.textoBotaoPrincipal}>Quero Participar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Tela 7: Perfil (Simulação)
  const renderPerfil = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('DASHBOARD')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Perfil e Ajustes</Text>
      <View style={styles.cardOpcao}>
        <Text style={styles.textoOpcao}>Nome: Usuário Anônimo</Text>
      </View>
      <TouchableOpacity 
        style={styles.cardOpcao}
        onPress={() => setModalAcessibilidadeVisivel(true)}
      >
        <Text style={styles.textoOpcao}>♿ Acessibilidade</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.cardOpcao}
        onPress={() => simularAcao('Sugestão', 'Funcionalidade de sugestão ainda não implementada.')}
      >
        <Text style={styles.textoOpcao}>📝 Sugerir Melhorias</Text>
      </TouchableOpacity>
    </View>
  );

  // --- NOVO: Tela 8: Cadastro ---
  const renderCadastro = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('BOAS_VINDAS')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Cadastro de Apoio</Text>
      <ScrollView>
        <Text style={styles.labelInput}>Nome Completo:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite seu nome ou o nome da organização" 
          value={nomeCadastro}
          onChangeText={setNomeCadastro}
          accessibilityLabel="Campo para nome completo"
        />
        
        <Text style={styles.labelInput}>Email de Contato:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="seu.email@exemplo.com"
          value={emailCadastro}
          onChangeText={setEmailCadastro}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Campo para email"
        />
        
        <Text style={styles.labelInput}>Endereço:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Rua, Numero, Bairro, Cidade"
          value={enderecoCadastro}
          onChangeText={setEnderecoCadastro}
          keyboardType="address"
          autoCapitalize="none"
          accessibilityLabel="Endereço"
        />

        <TouchableOpacity
          style={[styles.botaoPrincipal, { backgroundColor: COLORS.verdeEsperanca, marginTop: 30 }]}
          onPress={() => {
            // Validação simples
            if (!nomeCadastro || !emailCadastro || !tipoApoio) {
              simularAcao('Erro', 'Por favor, preencha todos os campos.');
              return;
            }
            // Simular cadastro
            simularAcao('Cadastro', `Cadastro de ${nomeCadastro} realizado com sucesso! Bem-vindo(a).`);
            // Definir o perfil e navegar para o dashboard
            selecionarPerfil('OFERECE_APOIO'); 
          }}
          accessibilityRole="button"
          accessibilityLabel="Finalizar cadastro e entrar"
        >
          <Text style={styles.textoBotaoPrincipal}>Finalizar Cadastro</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );


  // --- Modal de Acessibilidade ---
  const renderModalAcessibilidade = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalAcessibilidadeVisivel}
      onRequestClose={() => setModalAcessibilidadeVisivel(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitulo}>Acessibilidade</Text>
          
          <TouchableOpacity 
            style={styles.botaoAcessibilidadeModal}
            onPress={() => simularAcao('Libras', 'Simulação: Tradutor de Libras (Hand Talk) seria ativado.')}
          >
            <Text style={styles.textoBotaoAcessibilidade}>🤟 Traduzir para Libras</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.botaoAcessibilidadeModal}
            onPress={() => simularAcao('Leitura em Voz Alta', 'Simulação: Leitor de tela seria ativado.')}
          >
            <Text style={styles.textoBotaoAcessibilidade}>🔊 Leitura em Voz Alta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botaoAcessibilidadeModal}
            onPress={() => simularAcao('Modo Fácil', 'Simulação: Interface com fontes maiores e mais contraste.')}
          >
            <Text style={styles.textoBotaoAcessibilidade}>👁️ Modo Fácil (Alto Contraste)</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.botaoPrincipal, {backgroundColor: COLORS.vermelhoAlerta, marginTop: 20}]}
            onPress={() => setModalAcessibilidadeVisivel(false)}
          >
            <Text style={styles.textoBotaoPrincipal}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // --- Componentes Reutilizáveis ---

  const BotaoAcessibilidade = ({ onPress }) => (
    <TouchableOpacity 
      style={styles.fabAcessibilidade}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Abrir opções de acessibilidade"
    >
      <Text style={styles.fabIcone}>♿</Text>
    </TouchableOpacity>
  );

  const BotaoVoltar = ({ onPress }) => (
     <TouchableOpacity 
      style={styles.botaoVoltar}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Voltar para a tela anterior"
    >
      <Text style={styles.textoBotaoVoltar}>{'< Voltar'}</Text>
    </TouchableOpacity>
  );

  const CartaoDashboard = ({ icone, titulo, onPress, cor }) => (
    <TouchableOpacity 
      style={[styles.cartaoDashboard, { backgroundColor: cor }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={titulo}
    >
      <Text style={styles.iconeDashboard}>{icone}</Text>
      <Text style={styles.tituloCartaoDashboard}>{titulo}</Text>
    </TouchableOpacity>
  );


  // --- Renderização Principal ---
  
  const renderTela = () => {
    switch (telaAtual) {
      case 'BOAS_VINDAS':
        return renderBoasVindas();
      case 'DASHBOARD':
        return renderDashboard();
      case 'MAPA':
        return renderMapa();
      case 'CATALOGO':
        return renderCatalogo();
      case 'CHAT':
        return renderChat();
      case 'EVENTOS':
        return renderEventos();
      case 'PERFIL':
        return renderPerfil();
      // NOVO: Case para a tela de cadastro
      case 'CADASTRO':
        return renderCadastro();
      default:
        return renderBoasVindas();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderTela()}
      {renderModalAcessibilidade()}
      {/* O Botão de Acessibilidade é renderizado dentro da tela de Boas-Vindas 
          ou pode ser movido para fora do switch se for necessário em todas as telas */}
      {telaAtual !== 'BOAS_VINDAS' && <BotaoAcessibilidade onPress={() => setModalAcessibilidadeVisivel(true)} />}
    </SafeAreaView>
  );
}

// --- Estilos ---
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cinzaClaro,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.cinzaClaro,
  },
  // --- Boas Vindas ---
  tituloApp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.branco,
    textAlign: 'center',
  },
  subtituloApp: {
    fontSize: 18,
    color: COLORS.branco,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  cardEscolha: {
    backgroundColor: COLORS.branco,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tituloCard: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.preto,
    textAlign: 'center',
    marginBottom: 24,
  },
  botaoPrincipal: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  textoBotaoPrincipal: {
    color: COLORS.branco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  botaoSecundario: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.cinzaClaro,
  },
  textoBotaoSecundario: {
    color: COLORS.azulCalmo,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // --- Dashboard ---
  tituloPagina: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.preto,
    marginBottom: 20,
  },
  gridDashboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cartaoDashboard: {
    width: (width / 2) - 30, // Largura de 2 colunas com espaçamento
    height: 150,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconeDashboard: {
    fontSize: 32,
  },
  tituloCartaoDashboard: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.branco,
  },
  // --- Botão Voltar ---
  botaoVoltar: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 8,
  },
  textoBotaoVoltar: {
    fontSize: 16,
    color: COLORS.azulCalmo,
    fontWeight: 'bold',
  },
  // --- Mapa ---
  mapaPlaceholder: {
    height: 300,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapaPlaceholderTexto: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9E9E9E',
  },
  filtrosMapa: {
    flexDirection: 'row',
  },
  chipFiltro: {
    backgroundColor: COLORS.azulCalmo,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  chipTexto: {
    color: COLORS.branco,
    fontWeight: 'bold',
  },
  // --- Catálogo ---
  cardCatalogo: {
    backgroundColor: COLORS.branco,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconeCard: {
    fontSize: 36,
    marginRight: 16,
  },
  infoCard: {
    flex: 1, 
  },
  tituloCardCatalogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.preto,
  },
  textoCardCatalogo: {
    fontSize: 14,
    color: COLORS.preto,
    marginTop: 2,
  },
  botaoContato: {
    backgroundColor: COLORS.verdeEsperanca,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  textoBotaoContato: {
    fontSize: 20,
    color: COLORS.branco,
  },
  // --- Chat ---
  chatContainer: {
    flex: 1,
  },
  chatMensagem: {
    backgroundColor: COLORS.branco,
    padding: 12,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    marginBottom: 10,
    maxWidth: '85%',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chatMensagemUsuario: {
    backgroundColor: COLORS.azulCalmo,
    color: COLORS.branco,
    alignSelf: 'flex-end',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 0,
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: COLORS.cinzaClaro,
    position: 'absolute', 
    bottom: 0,
    left: 0,
    right: 0,
  },
  chatInput: { // Estilo de simulação de Input
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.branco,
    borderRadius: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  chatEnviar: {
    padding: 10,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.azulCalmo,
    alignSelf: 'center',
  },
  // --- Eventos ---
  cardEvento: {
    backgroundColor: COLORS.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tituloCardEvento: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.preto,
  },
  dataCardEvento: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.verdeEsperanca,
    marginVertical: 8,
  },
  textoCardEvento: {
    fontSize: 16,
    color: COLORS.preto,
    marginBottom: 16,
  },
  botaoParticipar: {
    backgroundColor: COLORS.verdeEsperanca,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center'
  },
  // --- Perfil ---
  cardOpcao: {
    backgroundColor: COLORS.branco,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textoOpcao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.preto,
  },

  // --- NOVO: Estilos do Cadastro ---
  labelInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.preto,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.branco,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    color: COLORS.preto,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  toggleBotao: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.azulCalmo,
    alignItems: 'center',
    backgroundColor: COLORS.branco,
  },
  toggleBotaoAtivo: {
    backgroundColor: COLORS.azulCalmo,
  },
  toggleTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.azulCalmo,
  },
  toggleTextoAtivo: {
    color: COLORS.branco,
  },
  // --- Acessibilidade (FAB e Modal) ---
  fabAcessibilidade: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.azulCalmo,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 100,
  },
  fabIcone: {
    fontSize: 28,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: COLORS.branco,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.preto,
    marginBottom: 20,
    textAlign: 'center',
  },
  botaoAcessibilidadeModal: {
    backgroundColor: COLORS.cinzaClaro,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  textoBotaoAcessibilidade: {
    fontSize: 18,
    color: COLORS.preto,
    textAlign: 'center',
    fontWeight: '500',
  },
});