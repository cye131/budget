<?php

/* accounts-overview.html */
class __TwigTemplate_4cc3f31f8d1daca7a1753be465314d369f649ae987e39a17edd59090b837681a extends Twig_Template
{
    private $source;

    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        // line 1
        $this->parent = $this->loadTemplate("layout.html", "accounts-overview.html", 1);
        $this->blocks = array(
            'staticlinks' => array($this, 'block_staticlinks'),
            'content' => array($this, 'block_content'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "layout.html";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 2
    public function block_staticlinks($context, array $blocks = array())
    {
    }

    // line 6
    public function block_content($context, array $blocks = array())
    {
        // line 7
        echo "    
    <section class=\"container\">
        <div class=\"row justify-content-md-center my-5\">
            <div class=\"col-md-12 w-100\" id=\"tsChart\"></div>
        </div>
    </section>
    
    <section class=\"container\">
        <div class=\"row justify-content-md-center my-2\">
            <table class=\"col-md-12 w-100\" id=\"tsTable\"></table>
        </div>
    </section>
        
";
    }

    public function getTemplateName()
    {
        return "accounts-overview.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  41 => 7,  38 => 6,  33 => 2,  15 => 1,);
    }

    public function getSourceContext()
    {
        return new Twig_Source("{% extends \"layout.html\" %}
{% block staticlinks %}
{% endblock %}


{% block content %}
    
    <section class=\"container\">
        <div class=\"row justify-content-md-center my-5\">
            <div class=\"col-md-12 w-100\" id=\"tsChart\"></div>
        </div>
    </section>
    
    <section class=\"container\">
        <div class=\"row justify-content-md-center my-2\">
            <table class=\"col-md-12 w-100\" id=\"tsTable\"></table>
        </div>
    </section>
        
{% endblock %}", "accounts-overview.html", "/var/www/budget.charlesye.me/public/templates/accounts-overview.html");
    }
}
