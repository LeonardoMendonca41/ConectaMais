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
  TextInput, 
  Linking, 
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';

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
const MOCK_SERVICOS_INICIAL = [
  { id: '1', categoria: 'Alimentação', nome: 'Restaurante Popular I', endereco: 'Av. Contorno, 11484 - Centro, Belo Horizonte', fone: '(31) 3277-6969', icone: '🍲', coordinate: { latitude: -19.9325, longitude: -43.9180 } },
  { id: '2', categoria: 'Abrigo', nome: 'Albergue Municipal Tia Branca', endereco: 'Rua Conselheiro Rocha, 351 - Floresta, Belo Horizonte', fone: '(31) 3277-4999', icone: '🏠', coordinate: { latitude: -19.9100, longitude: -43.9240 } },
  { id: '3', categoria: 'Saúde', nome: 'Centro de Saúde Savassi', endereco: 'R. Paraíba, 890 - Savassi, Belo Horizonte', fone: '(31) 3277-7722', icone: '🩺', coordinate: { latitude: -19.9340, longitude: -43.9310 } },
  { id: '4', categoria: 'Emprego', nome: 'CRAS Vila Marçola', endereco: 'R. Engenheiro Lucas Júlio de Proença, 73 - Serra, Belo Horizonte', fone: '(31) 3277-4300', icone: '👔', coordinate: { latitude: -19.9400, longitude: -43.9150 } },
  { id: '5', categoria: 'Educação', nome: 'Biblioteca Pública Estadual', endereco: 'Praça da Liberdade, 21 - Savassi, Belo Horizonte', fone: '(31) 3269-1166', icone: '📚', coordinate: { latitude: -19.9320, longitude: -43.9340 } },
];

const MOCK_EVENTOS = [
  { id: '1', titulo: 'Feirão de Emprego - Praça da Estação', data: '30/10 - 09h', desc: 'Leve seu currículo e documentos. Diversas vagas disponíveis.' },
  { id: '2', titulo: 'Campanha de Vacinação (Gripe)', data: '01/11 - 10h às 16h', desc: 'No Centro de Saúde Savassi (ver catálogo).' },
  { id: '3', titulo: 'Distribuição de Cestas Básicas', data: '02/11 - 08h', desc: 'Local: Albergue Tia Branca. Necessário cadastro prévio.' },
];

// Opções para o formulário de cadastro
const CATEGORIAS_APOIO = ['Alimentação', 'Abrigo', 'Saúde', 'Emprego', 'Educação', 'Outro'];

// --- Componente Principal do App ---
export default function App() {
 
  const [telaAtual, setTelaAtual] = useState('BOAS_VINDAS'); // BOAS_VINDAS, DASHBOARD, MAPA, CATALOGO, CONTATOS, EVENTOS, PERFIL, CADASTRO, ALERTAS, NOVO_ALERTA, LOGIN_CADASTRO_APOIO, LOGIN
  const [perfilUsuario, setPerfilUsuario] = useState(null); // 'NECESSITA_APOIO', 'OFERECE_APOIO'
  
  // Serviços agora são um estado
  const [servicos, setServicos] = useState(MOCK_SERVICOS_INICIAL);

  
  const [alertas, setAlertas] = useState([
      ]);

  // Estado para o Modal de Acessibilidade
  const [modalAcessibilidadeVisivel, setModalAcessibilidadeVisivel] = useState(false);

  // --- Estados para o formulário de cadastro ---
  const [nomeCadastro, setNomeCadastro] = useState('');
  const [emailCadastro, setEmailCadastro] = useState('');
  const [ruaCadastro, setRuaCadastro] = useState('');
  const [numeroCadastro, setNumeroCadastro] = useState('');
  const [bairroCadastro, setBairroCadastro] = useState('');
  const [cidadeCadastro, setCidadeCadastro] = useState('');
  const [telefoneCadastro, setTelefoneCadastro] = useState('');
  const [tipoApoioCadastro, setTipoApoioCadastro] = useState('');
  const [senhaCadastro, setSenhaCadastro] = useState('');
  const [confirmarSenhaCadastro, setConfirmarSenhaCadastro] = useState('');
  
  // *** Formulário de novo alerta ***
  const [tituloAlerta, setTituloAlerta] = useState('');
  const [descAlerta, setDescAlerta] = useState('');
  
  // *** Estados para formulário de Login ***
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  

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
    // Alert nativo do React Native
    Alert.alert(titulo, mensagem);
  };

  // *** Função para abrir WhatsApp ***
  const abrirWhatsApp = (fone, nome) => {
    // Limpa o número de telefone (remove espaços, traços, parênteses)
    const numeroLimpo = fone.replace(/\D/g, '');
    const mensagem = `Olá, ${nome}! Vi seu contato no app Conecta+ e gostaria de uma informação.`;
    
    // Formato do link do WhatsApp
    const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;

    // Tenta abrir o link
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          simularAcao('Erro', `Não foi possível abrir o WhatsApp. Verifique se ele está instalado.`);
        }
      })
      .catch(err => simularAcao('Erro', 'Ocorreu um erro ao tentar abrir o WhatsApp.'));
  };

  // Helper para pegar ícone
  const getIconePorCategoria = (categoria) => {
    switch (categoria) {
      case 'Alimentação': return '🍲';
      case 'Abrigo': return '🏠';
      case 'Saúde': return '🩺';
      case 'Emprego': return '👔';
      case 'Educação': return '📚';
      default: return '🤝'; // 'Outro' ou padrão
    }
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
          onPress={() => {
            // *** Navega para a tela de escolha (Login ou Cadastro) ***
            navegarPara('LOGIN_CADASTRO_APOIO');
          }}
          accessibilityRole="button"
          accessibilityLabel="Quero oferecer apoio. Toque para entrar ou se cadastrar."
        >
          <Text style={styles.textoBotaoSecundario}>Quero oferecer apoio</Text>
        </TouchableOpacity>
      </View>
      
      <BotaoAcessibilidade onPress={() => setModalAcessibilidadeVisivel(true)} />
    </View>
  );

  // *** Tela Intermediária para Apoiadores ***
  const renderLoginCadastroApoio = () => (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      <BotaoVoltar onPress={() => navegarPara('BOAS_VINDAS')} />
      
      <View style={styles.cardEscolha}>
        <Text style={styles.tituloCard}>Área do Apoiador</Text>
        <TouchableOpacity
          style={[styles.botaoPrincipal, { backgroundColor: COLORS.azulCalmo }]}
          onPress={() => navegarPara('LOGIN')}
          accessibilityLabel="Já tenho cadastro. Toque para entrar."
        >
          <Text style={styles.textoBotaoPrincipal}>Já tenho cadastro (Entrar)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.botaoSecundario]}
          onPress={() => navegarPara('CADASTRO')}
          accessibilityLabel="Quero me cadastrar para oferecer apoio."
        >
          <Text style={styles.textoBotaoSecundario}>Criar novo cadastro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  // Tela 2: Dashboard (Menu Principal)
  const renderDashboard = () => (
    <View style={styles.container}>
      <Text style={styles.tituloPagina}>Olá! O que você busca?</Text>
      <ScrollView contentContainerStyle={styles.gridDashboard}>
        <CartaoDashboard icone="🗺️" titulo="Serviços próximos" onPress={() => navegarPara('MAPA')} cor={COLORS.azulCalmo} />
        <CartaoDashboard icone="📚" titulo="Catálogo de Serviços" onPress={() => navegarPara('CATALOGO')} cor={COLORS.verdeEsperanca} />
        <CartaoDashboard icone="📞" titulo="Contatos / WhatsApp" onPress={() => navegarPara('CONTATOS')} cor={COLORS.amareloSuave} />
        <CartaoDashboard icone="📅" titulo="Eventos e Vagas" onPress={() => navegarPara('EVENTOS')} cor={COLORS.azulCalmo} />
        <CartaoDashboard icone="📢" titulo="Alertas Urgentes" onPress={() => navegarPara('ALERTAS')} cor={COLORS.vermelhoAlerta} />
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

  // Tela 3: Mapa (com MapView)
  const renderMapa = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('DASHBOARD')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Mapa de Serviços</Text>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.mapView}
          initialRegion={{
            latitude: -19.925,    
            longitude: -43.93,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {servicos.map(servico => (
            <Marker
              key={servico.id}
              coordinate={servico.coordinate} 
              title={servico.nome}
              description={servico.endereco}
            />
          ))}
        </MapView>
      </View>
      
      <View style={styles.filtrosMapa}>
        <TouchableOpacity style={styles.chipFiltro}><Text style={styles.chipTexto}>🍲 Alimentação</Text></TouchableOpacity>
        <TouchableOpacity style={styles.chipFiltro}><Text style={styles.chipTexto}>🏠 Abrigo</Text></TouchableOpacity>
        <TouchableOpacity style={styles.chipFiltro}><Text style={styles.chipTexto}>🩺 Saúde</Text></TouchableOpacity>
      </View>
      
      <Text style={[styles.tituloPagina, {fontSize: 20, marginTop: 20}]}>Serviços na Área (Lista)</Text>
      <ScrollView style={{flex: 1}}>
        {servicos.map(servico => (
          <View key={servico.id} style={styles.cardCatalogo}>
            <Text style={styles.iconeCard}>{servico.icone}</Text>
            <View style={styles.infoCard}>
              <Text style={styles.tituloCardCatalogo}>{servico.nome}</Text>
              <Text style={styles.textoCardCatalogo}>{servico.endereco}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View> 
  );

  // Tela 4: Catálogo de Serviços
  const renderCatalogo = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('DASHBOARD')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Catálogo de Apoio</Text>
      
      <ScrollView>
        {servicos.map(servico => (
          <View key={servico.id} style={styles.cardCatalogo}>
            <Text style={styles.iconeCard}>{servico.icone}</Text>
            <View style={styles.infoCard}>
              <Text style={styles.tituloCardCatalogo}>{servico.nome}</Text>
              <Text style={styles.textoCardCatalogo}>{servico.categoria}</Text>
              <Text style={styles.textoCardCatalogo}>{servico.endereco}</Text>
            </View>
            <TouchableOpacity 
              style={styles.botaoContato}
              onPress={() => simularAcao('Contato', `Ligando para ${servico.nome}...\n${servico.fone}`)}
              accessibilityLabel={`Ligar para ${servico.nome}`}
            >
              <Text style={styles.textoBotaoContato}>📞</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Tela 5 agora é 'Contatos' ***
  const renderContatos = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('DASHBOARD')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Contatos / WhatsApp</Text>
      <Text style={[styles.subtituloApp, {color: COLORS.preto, fontSize: 16, marginBottom: 20, textAlign: 'left'}]}>
        Entre em contato direto com os serviços de apoio.
      </Text>
      <ScrollView>
        {servicos.map(servico => (
          <View key={servico.id} style={styles.cardCatalogo}>
            <Text style={styles.iconeCard}>{servico.icone}</Text>
            <View style={styles.infoCard}>
              <Text style={styles.tituloCardCatalogo}>{servico.nome}</Text>
              <Text style={styles.textoCardCatalogo}>{servico.categoria}</Text>
              <Text style={[styles.textoCardCatalogo, {fontWeight: 'bold'}]}>{servico.fone}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.botaoContato, {backgroundColor: COLORS.verdeEsperanca, width: 50, height: 50, borderRadius: 25}]}
              onPress={() => abrirWhatsApp(servico.fone, servico.nome)}
              accessibilityLabel={`Conversar no WhatsApp com ${servico.nome}`}
            >
              <Text style={styles.textoBotaoContato}>💬</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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

  // Tela 7: Perfil
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

  // Tela 8: Cadastro
  const renderCadastro = () => (
    <View style={styles.container}>
      {/* *** MUDANÇA: Botão voltar agora leva para a tela de escolha *** */}
      <BotaoVoltar onPress={() => navegarPara('LOGIN_CADASTRO_APOIO')} />
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

        {/* *** Campos de Senha *** */}
        <Text style={styles.labelInput}>Senha:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Crie uma senha" 
          value={senhaCadastro}
          onChangeText={setSenhaCadastro}
          secureTextEntry={true}
          accessibilityLabel="Campo para senha"
        />

        <Text style={styles.labelInput}>Confirmar Senha:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Confirme sua senha" 
          value={confirmarSenhaCadastro}
          onChangeText={setConfirmarSenhaCadastro}
          secureTextEntry={true}
          accessibilityLabel="Campo para confirmar senha"
        />
        {/* *** FIM (Campos de Senha) *** */}

        <Text style={styles.labelInput}>Telefone (com DDD):</Text>
        <TextInput 
          style={styles.input} 
          placeholder="(31) 99999-9999"
          value={telefoneCadastro}
          onChangeText={setTelefoneCadastro}
          keyboardType="phone-pad"
          accessibilityLabel="Campo para Telefone"
        />

        {/* *** Campos de endereço separados *** */}
        <Text style={styles.labelInput}>Rua / Avenida:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Av. Afonso Pena"
          value={ruaCadastro}
          onChangeText={setRuaCadastro}
          accessibilityLabel="Rua ou Avenida"
        />

        <Text style={styles.labelInput}>Número:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: 100"
          value={numeroCadastro}
          onChangeText={setNumeroCadastro}
          keyboardType="numeric"
          accessibilityLabel="Número do endereço"
        />

        <Text style={styles.labelInput}>Bairro:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Centro"
          value={bairroCadastro}
          onChangeText={setBairroCadastro}
          accessibilityLabel="Bairro"
        />

        <Text style={styles.labelInput}>Cidade:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Belo Horizonte"
          value={cidadeCadastro}
          onChangeText={setCidadeCadastro}
          accessibilityLabel="Cidade"
        />
        {/* *** FIM DA MUDANÇA *** */}

        <Text style={styles.labelInput}>Tipo de Apoio Oferecido:</Text>
        <View style={styles.toggleContainer}>
          {CATEGORIAS_APOIO.map(categoria => (
            <TouchableOpacity
              key={categoria}
              style={[
                styles.chipFiltro,
                tipoApoioCadastro === categoria ? {backgroundColor: COLORS.verdeEsperanca} : {backgroundColor: COLORS.azulCalmo, opacity: 0.7}
              ]}
              onPress={() => setTipoApoioCadastro(categoria)}
            >
              <Text style={styles.chipTexto}>{getIconePorCategoria(categoria)} {categoria}</Text>
            </TouchableOpacity>
          ))}
        </View>


        <TouchableOpacity
          style={[styles.botaoPrincipal, { backgroundColor: COLORS.verdeEsperanca, marginTop: 30 }]}
          onPress={() => {
            // *** Validação e construção do endereço ***
            // Validação simples
            if (!nomeCadastro || !emailCadastro || !telefoneCadastro || !tipoApoioCadastro || !ruaCadastro || !numeroCadastro || !bairroCadastro || !cidadeCadastro || !senhaCadastro || !confirmarSenhaCadastro) {
              simularAcao('Erro', 'Por favor, preencha todos os campos.');
              return;
            }

            // *** Validação de Senha ***
            if (senhaCadastro !== confirmarSenhaCadastro) {
              simularAcao('Erro', 'As senhas não coincidem.');
              return;
            }

            // 1. Criar novo serviço
            const novoId = (servicos.length + 1).toString();

            const novaCoordenada = {
              latitude: -19.92 + (Math.random() - 0.5) * 0.05, 
              longitude: -43.93 + (Math.random() - 0.5) * 0.05,
            };

            // *** Construir endereço completo ***
            const enderecoCompleto = `${ruaCadastro}, ${numeroCadastro} - ${bairroCadastro}, ${cidadeCadastro}`;

            const novoServico = {
              id: novoId,
              categoria: tipoApoioCadastro,
              nome: nomeCadastro,
              endereco: enderecoCompleto, 
              fone: telefoneCadastro,
              icone: getIconePorCategoria(tipoApoioCadastro),
              coordinate: novaCoordenada 
            };

            // 2. Adicionar ao state global de serviços
            setServicos(prevServicos => [...prevServicos, novoServico]);

            // 3. Limpar formulário
            setNomeCadastro('');
            setEmailCadastro('');
            // *** MUDANÇA: Limpar campos de endereço ***
            setRuaCadastro('');
            setNumeroCadastro('');
            setBairroCadastro('');
            setCidadeCadastro('');
            setTelefoneCadastro('');
            setTipoApoioCadastro('');
            // *** NOVO: Limpar campos de senha ***
            setSenhaCadastro('');
            setConfirmarSenhaCadastro('');

            // 4. Simular cadastro
            simularAcao('Cadastro', `Cadastro de ${nomeCadastro} realizado com sucesso! Bem-vindo(a).`);
            
            // 5. Definir o perfil e navegar para o dashboard
            setPerfilUsuario('OFERECE_APOIO');
            navegarPara('DASHBOARD'); 
          }}
          accessibilityRole="button"
          accessibilityLabel="Finalizar cadastro e entrar"
        >
          <Text style={styles.textoBotaoPrincipal}>Finalizar Cadastro</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // *** Tela 9: Login ***
  const renderLogin = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('LOGIN_CADASTRO_APOIO')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Login do Apoiador</Text>
      <ScrollView>
        <Text style={styles.labelInput}>Email:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="seu.email@exemplo.com" 
          value={emailLogin}
          onChangeText={setEmailLogin}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Text style={styles.labelInput}>Senha:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Sua senha"
          value={senhaLogin}
          onChangeText={setSenhaLogin}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={[styles.botaoPrincipal, { backgroundColor: COLORS.azulCalmo, marginTop: 30 }]}
          onPress={() => {
            // (Lógica de login simulada)
            if (!emailLogin || !senhaLogin) {
              simularAcao('Erro', 'Preencha email e senha.');
              return;
            }
            
            // 1. Limpar formulário
            setEmailLogin('');
            setSenhaLogin('');

            // 2. Simular sucesso
            simularAcao('Login', `Login realizado com sucesso!`);
            
            // 3. Definir o perfil e navegar para o dashboard
            setPerfilUsuario('OFERECE_APOIO');
            navegarPara('DASHBOARD'); 
          }}
        >
          <Text style={styles.textoBotaoPrincipal}>Entrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );


  // *** Tela 10: Lista de Alertas ***
  const renderAlertas = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('DASHBOARD')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Alertas Urgentes</Text>

      {/* Botão: Só aparece se for 'OFERECE_APOIO' */}
      {perfilUsuario === 'OFERECE_APOIO' && (
        <TouchableOpacity 
          style={[styles.botaoPrincipal, {backgroundColor: COLORS.vermelhoAlerta, marginBottom: 20}]}
          onPress={() => navegarPara('NOVO_ALERTA')}
        >
          <Text style={styles.textoBotaoPrincipal}>📢 Adicionar Novo Alerta</Text>
        </TouchableOpacity>
      )}

      <ScrollView>
        {alertas.length === 0 ? (
          <Text style={styles.textoCardEvento}>Nenhum alerta urgente no momento.</Text>
        ) : (
          alertas.map(alerta => (
            <View key={alerta.id} style={[styles.cardEvento, {borderColor: COLORS.vermelhoAlerta, borderWidth: 2, backgroundColor: '#FFF8F8'}]}>
              <Text style={[styles.tituloCardEvento, {color: COLORS.vermelhoAlerta}]}>📢 {alerta.titulo}</Text>
              <Text style={[styles.textoCardEvento, {marginBottom: 0, marginTop: 8}]}>{alerta.desc}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );

  // *** Tela 11: Formulário de Novo Alerta ***
  const renderNovoAlerta = () => (
    <View style={styles.container}>
      <BotaoVoltar onPress={() => navegarPara('ALERTAS')} />
      <Text style={[styles.tituloPagina, {textAlign: 'center', marginTop: 30}]}>Novo Alerta Urgente</Text>
      <ScrollView>
        <Text style={styles.labelInput}>Título do Alerta:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Risco de Enchente" 
          value={tituloAlerta}
          onChangeText={setTituloAlerta}
        />
        
        <Text style={styles.labelInput}>Descrição Completa:</Text>
        <TextInput 
          style={styles.inputMultilinha} 
          placeholder="Descreva a situação, locais afetados, recomendações..."
          value={descAlerta}
          onChangeText={setDescAlerta}
          multiline={true}
          numberOfLines={6}
        />

        <TouchableOpacity
          style={[styles.botaoPrincipal, { backgroundColor: COLORS.vermelhoAlerta, marginTop: 30 }]}
          onPress={() => {
            if (!tituloAlerta || !descAlerta) {
              simularAcao('Erro', 'Preencha o título e a descrição.');
              return;
            }

            // 1. Criar novo alerta
            const novoAlerta = {
              id: new Date().toISOString(),
              titulo: tituloAlerta,
              desc: descAlerta,
            };

            // 2. Adicionar ao início da lista de alertas
            setAlertas(prevAlertas => [novoAlerta, ...prevAlertas]);

            // 3. Limpar formulário
            setTituloAlerta('');
            setDescAlerta('');

            // 4. Voltar para a lista
            navegarPara('ALERTAS');
          }}
        >
          <Text style={styles.textoBotaoPrincipal}>Publicar Alerta</Text>
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
      // Case 'CHAT' para 'CONTATOS' ***
      case 'CONTATOS':
        return renderContatos();
      case 'EVENTOS':
        return renderEventos();
      case 'PERFIL':
        return renderPerfil();
      case 'CADASTRO':
        return renderCadastro();
      case 'LOGIN_CADASTRO_APOIO':
        return renderLoginCadastroApoio();
      case 'LOGIN':
        return renderLogin();
      case 'ALERTAS':
        return renderAlertas();
      case 'NOVO_ALERTA':
        return renderNovoAlerta();
      default:
        return renderBoasVindas();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderTela()}
      {renderModalAcessibilidade()}
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
    width: (width / 2) - 30,
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
  mapContainer: {
    height: 300, // Altura do mapa
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden', // Garante que o mapa fique dentro das bordas
    marginBottom: 20,
    backgroundColor: '#E0E0E0', // Cor de fundo enquanto o mapa carrega
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  mapaPlaceholder: { // (Mantido para referência, mas não usado em 'renderMapa')
    height: 200,
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
    marginBottom: 10,
  },
  chipTexto: {
    color: COLORS.branco,
    fontWeight: 'bold',
  },
  // --- Catálogo / Contatos ---
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
    backgroundColor: COLORS.azulCalmo,
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

  // --- Estilos do Cadastro ---
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
  // *** ESTILO ***
  inputMultilinha: {
    backgroundColor: COLORS.branco,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0', 
    fontSize: 16,
    color: COLORS.preto,
    height: 120, 
    textAlignVertical: 'top', 
  },
  toggleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    marginTop: 8,
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